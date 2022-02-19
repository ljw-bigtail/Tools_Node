class VirtualList{
  // TODO 增加 loading  增加滚动时 动态处理多的dom
  constructor(option){
    this.options = {
      domSelecter: option.id ? ("#" + option.id) : 'body', // list box id
      size: option.size, // size
      dataPromise: option.dataPromise, // get data ajax promise
      template: option.template, // node function(item) 返回自定义 item
      advance: option.advance ? this.option.advance : 80, // 距离底部 80px 就认为到了底部
      timeOutNum: typeof option.timeOutNum == 'number' ? option.timeOutNum : 100, // 滚动时间的 防抖延时
    }
    this.$box = document.querySelector(this.options.domSelecter); // 盒子
    this.$ = this.getUl(); // 列表

    this.scrollTop = 0; // 当前滚动距离
    this.nodeHeight = 0; // 获取node的高度
    this.index = 0; // 当前滚动到那个node
    this.step = 0; // 每页显示数量

    this.remot_page = 1; // 当前异步数据页面`
    this.remot_data = []; // 列表数据

    this.init()
  }
  init(){
    // 初始化项目
    this.appendHtml(`
      <style>
        ul, li{overflow: hidden;margin: 0;padding: 0;border: none;list-style: none;}
      </style>
    `, -1, this.$.$box) // overflow 用来处理 li内的margin超出的问题
    this.initEvent() // 事件绑定在盒子上 或者 使用委托处理其他事件
    if(this.options.dataPromise && typeof this.options.dataPromise == 'function'){
      // 支持 异步数据
      this.loadRemotData()
    }else{
      // TODO 使用远程模式的处理方法
    }
  }
  nodeTemplate(index){
    // 根据模版 返回node结构
    const item = this.remot_data[index]
    if(!item) return
    const temp = this.options.template ? this.options.template(item, index) : item
    return `<li data-index="${index}">${temp}</li>`
  }
  getNodeHeight(){
    // 获取一个item的高度
    if(this.nodeHeight) return
    this.appendHtml(`<ul id="hiddenBox" style="position: absolute; top: -100%; left: -100%; visibility: hidden;">${this.nodeTemplate(0)}</ul>`, -1, this.$box)
    const node = this.$box.querySelector('#hiddenBox')
    this.nodeHeight = node.offsetHeight
    this.$box.removeChild(node)
  }
  getscrollNodeQty(scrollDistance){
    // 根据滚动距离 获取 应该加载的node数量
    return parseInt(scrollDistance / this.nodeHeight) + 1
  }
  getStep(){
    // 计算 前端分页
    if(this.step) return
    if(this.options.size == 'auto'){
      const windowHeight = window.innerHeight || document.documentElement.clientHeight
      if(windowHeight / this.nodeHeight < 1){
        // TODO nodea高度超出一页 处理
        console.error('nodea高度超出一页 算法不适合')
        return 5
      }
      const preRenderPage = 2
      this.step =  Math.floor(windowHeight / this.nodeHeight * preRenderPage)
    }else{
      this.step = this.options.size
    }
  }
  getUl(){
    // 初始化 列表
    this.$box.innerHTML = '<ul></ul>'
    return this.$box.querySelector('ul')
  }
  loadRemotData(){
    // 使用promise 加载远程数据
    const that = this
    this.options.dataPromise(this.remot_page).then((res)=>{
      if(!res || res.length == 0) return
      that.remot_data = that.remot_data.concat(res)
      that.getNodeHeight(); // 获取node的高度，内部判断只使用一次
      that.getStep(); // 每页显示数量，内部判断只使用一次
      that.updateHtml(that.step); // 更新 node
    })
  }
  appendHtml(html, index = -1, $){
    // 往$的第index位置插入html
    const dom = $ ? $ : this.$
    let divTemp = document.createElement("div"),
        nodes = null, // 文档片段，一次性append，提高性能
        fragment = document.createDocumentFragment(); // 避免引起dom回流
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;
    for (var i=0, length=nodes.length; i<length; i+=1) {
      fragment.appendChild(nodes[i].cloneNode(true));
    }
    if(dom.hasChildNodes() && index > -1){
      dom.insertBefore(fragment, dom.childNodes[index + 1]);
    }else{ 
      dom.appendChild(fragment);
    }
  }
  addNode(index_interval, position_index = -1){
    // 从index_interval[0] 加载到index_interval[1]
    let html = ''
    if(!index_interval || index_interval.length != 2){}
    for (let index = index_interval[0]; index < index_interval[1]; index++) {
      html += this.nodeTemplate(index)
    }
    this.appendHtml(html, position_index)
  }
  delNode(index = 0, length = 1){
    // TODO 还没用上 
    // 思路：超出长度到部分 隐藏或删除
    // this.delNode(1, 3)
    // 删除dom
    if(this.$.hasChildNodes()){
      for (let i = length; i > 0; i--) {
        const rm_node = index > 0 && index < this.remot_data.length ? this.$.childNodes[index] : this.$.lastChild
        this.$.removeChild(rm_node)
      }
    }
  }
  debounce(fn, wait = 0){
    // 防抖
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }
  scrollEvent(e){
    // 盒子的滚动事件
    const scrollTop = e.target.scrollingElement.scrollTop
    if(scrollTop == this.scrollTop){ return console.log('没滚动') && false;}
    let scrollDistance = Math.abs(scrollTop - this.scrollTop)
    let scrollQty = this.getscrollNodeQty(scrollDistance)
    if(scrollTop > this.scrollTop){
      // 向下滚动
      console.log('向下滚动数量', scrollQty);
      this.updateHtml(scrollQty)
      if(scrollTop + this.options.advance + window.innerHeight >= e.target.scrollingElement.scrollHeight){
        // 滚动到底部 ajax获取数据
        console.log('滚动到底部');
        this.remot_page += 1
        this.loadRemotData()
      }
    }else{
      console.log('向上滚动数量', scrollQty);
      // 向上滚动
    }
    this.scrollTop = scrollTop
  }
  initEvent(){
    // 初始化事件
    const that = this
    this.$box.onscroll = this.debounce(e=>{ that.scrollEvent(e) }, this.options.timeOutNum)
  }
  updateHtml(page_length){
    const start_index = this.index
    // 从第index个 渲染下一页数据
    let end_index = start_index + page_length
    if(end_index > this.remot_data.length){
      // console.error('updateHtml index参数超出范围(大)。');
      end_index = this.remot_data.length
    }
    if(start_index == end_index){
      console.log('数据加载完了。');
      return
    }
    this.addNode([start_index, end_index])
    this.index = end_index
  }
}