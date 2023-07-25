import "./style.less";
import { AppConfig } from "@/utils/types";
import { ElementsUtils, Cache, copy } from "@/utils/utils";

(function () {
  // 配置 start
  const site_support = ['www.boldoversizeshop.com']
  // 配置 end

  const cacheKey = "quick-utils-config";
  let configCache: AppConfig = Cache.get(cacheKey);

  const Listening = (callback: Function)=>{
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      const {actions, data} = message.data
      switch(actions){
        case "get": 
          sendResponse(configCache);
          break;
        case "set": 
          callback(data as AppConfig)
          break;
      }
    })
  }

  const TopLinkMode: {
    $products: HTMLElement|null
    $productItems: NodeListOf<Element>|null|undefined
    $tips: HTMLElement|null
    list: string[]
    init: Function
    initDom: Function
    initEvent: Function
    refresh: Function
    renderTop: Function
    getUrl: Function
  } = {
    $products: null,
    $productItems: null,
    $tips: null,
    list:[],
    init(){
      this.$products = document.querySelector("#ProductGridContainer #product-grid")
      this.$productItems = this.$products?.querySelectorAll('.grid__item')
      ElementsUtils.appendHTML(document.body, `
        <div class="topLinkMode-tip">
          <button class="leoui-button copyBtn">复制</button>
          <dl>
          </dl>
        </div>
      `)
      this.$tips = document.querySelector(".topLinkMode-tip")

      // 初始化置顶
      const url = new URL(window.location.href)
      const sort_by = url.searchParams.get("sort_by")?.split(",")
      if(sort_by){
        this.list = sort_by
      }
      this.renderTop()
      
      this.initDom()
      this.initEvent()
    },
    renderTop(){
      if(!this.$tips){return}
      const dl = this.$tips.querySelector("dl")
      if(!dl){return}
      dl.innerHTML = this.list.reduce((sum, item) => {
        return sum + `
          <dd>${item}</dd>
        `
      }, "")
      if(this.list.length > 0){
        this.$tips.classList.add("open")
      }else{
        this.$tips.classList.remove("open")
      }
    },
    async getUrl(){
      const url = new URL(window.location.href)
      url.searchParams.set("sort_by", this.list.join(','))
      const isCopy = await copy(url.href)
      if(!isCopy){
        alert(`自动复制异常，请手动复制：\n${url.href}`)
      }else{
        // alert('文本已成功复制到剪贴板');

        // chrome.runtime.sendMessage({
        //   data: 1,
        //   meg: "复制成功，关闭置顶模式"                                                                                                                                                                                                                                                                                                                                                
        // })

        configCache.topLinkMode = false
        TopLinkMode.refresh(configCache.topLinkMode) 
        Cache.set(cacheKey, configCache);

        this.$tips?.classList.remove("open")
      }
    },
    initDom(){
      if(!this.$productItems || !this.$products){
        return
      }
      const _this = this
      this.$products.classList.add("topLinkMode-status")
      this.$productItems.forEach(function(productItem) {
        productItem.classList.add("topLinkMode-box")
        // 根据 已有的sort_by 处理按钮是否是置顶
        const id = productItem.querySelector(".card__heading a")?.getAttribute("href")?.replace(/\/products\/([\d\D]*)/, "$1")
        const status = _this.list.findIndex(item => item === id) !== -1
        ElementsUtils.appendHTML(productItem, `
          <div class="topLinkMode-selector">
            <div class="topLinkMode-selector-btn">
              <button class="leoui-button toTop ${status ? "toggled" : ""}">
                <span>置顶</span>
                <span>取消置顶</span>
              </button>
            </div>
          </div>
        `)
      })
    },
    initEvent(){
      if(!this.$productItems || !this.$products){
        return
      }
      const _this = this
      // 按钮点击
      ElementsUtils.delegateEvent(this.$products, "click", ".toTop", function(event){
        const productItem = ElementsUtils.parents(event.target as HTMLElement, ".topLinkMode-box")[0]
        if(productItem){
          const btn = productItem.querySelector(".toTop")
          const id = productItem.querySelector(".card__heading a")?.getAttribute("href")?.replace(/\/products\/([\d\D]*)/, "$1")
          if(id && btn){
            if(btn.classList.contains("toggled")){
              // 取消置顶
              const index = _this.list.findIndex(item => item === id)
              _this.list.splice(index, 1)
              btn.classList.remove("toggled")
            }else{
              // 置顶
              _this.list.push(id)
              btn.classList.add("toggled")
            }
          }
        }
        _this.renderTop()
      })
      // ElementsUtils.delegateEvent(this.$products, "click", ".toTop", function(event){
      document.querySelector(".topLinkMode-tip .copyBtn")?.addEventListener("click", function(){
        _this.getUrl()
      })
    },
    refresh(state: boolean){
      console.log("运营工具箱 -- Starting", state);
      if(state){
        if(this.$products && this.$products.classList.contains("topLinkMode-status")){
          // show
          this.$products.classList.remove("close")
          this.$tips && this.$tips.classList.add("open")
        }else{
          // init
          this.init()
        }
      }else{
        // hide
        if(this.$products && this.$products.classList.contains("topLinkMode-status")){
          this.$products.classList.add("close")
          this.$tips && this.$tips.classList.remove("open")
        }
      }
    }
  }
  
  const siteCheck = ()=>{
    return site_support.findIndex(url => {
      return url == window.location.host
    }) !== -1 && window.location.pathname.indexOf("/collections") === 0
  }

  function init() {
    const checkedPass = siteCheck()
    if(!checkedPass){
      return 
    }
    if(configCache.topLinkMode){
      TopLinkMode.refresh(configCache.topLinkMode)
    }
    Listening((config: AppConfig)=>{
      if(config.topLinkMode != configCache.topLinkMode){
        TopLinkMode.refresh(config.topLinkMode)
      }
      configCache = config
      Cache.set(cacheKey, configCache);
    })
  }

  try{
    // load init
    if (document.readyState === "loading") {
      // 此时加载尚未完成
      document.addEventListener("DOMContentLoaded", init);
    } else {
      // 此时`DOMContentLoaded` 已经被触发
      init();
    }
  }catch(err){
    console.log(err)
  }
})();
