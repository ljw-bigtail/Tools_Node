/**
 * 功能：弹框。
 * 支持预设尺寸
 **/

interface MesData {
  header?: string;
  content: string;
  footer?: string;
}

interface NotificationOptions {
  keep: number;
}

class Notifications {
  id: 'common_notificationOptions_box';
  dom: HTMLElement | null;
  keep: number;
  constructor(options: NotificationOptions) {
    this.id = 'common_notificationOptions_box';
    this.dom = null;
    this.keep = options.keep || 8000
    this.init();
  }
  private appendHTML = ElementsUtils.appendHTML;
  init() {
    this.initBox();
    this.initEvent();
  }
  add(data:MesData){
    const that = this;
    this.dom?.classList.add("open");
    const dom_item = this.renderItem(data);
    setTimeout(function(){
      dom_item?.classList.add('open')
    }, 100)
    if(!dom_item) return
    var timer: number | null | undefined = null
    if(this.keep >= 0){
      (function(item: Element){
        timer = setTimeout(function(){
          item.remove()
        }, that.keep)
      })(dom_item)
    }
    dom_item.addEventListener('mouseover', function(){
      timer && clearTimeout(timer)
    })
    return function(){
      that.close(dom_item as HTMLElement);
    }
  }
  private renderItem(item:MesData){
    const dom = (this.dom?.querySelector('.notification-box')) as HTMLElement
    if(!dom) return
    this.appendHTML(
      dom,
      `
        <div class="notification-item">
          <div class="notification-item-close"><span class="iconfont">×</span></div>
          ${item.header ? `<div class="notification-item-header">${item.header}</div>` : ''}
          <div class="notification-item-content">${item.content}</div>
          ${item.footer ? `<div class="notification-item-footer">${item.footer}</div>` : ''}
        </div>
      `
    )
    return dom.children[dom.children.length - 1]
  }
  destory() {
    this.dom?.remove();
  }
  private close(item: HTMLElement) {
    item.classList.remove("open");
    setTimeout(function(){
      item.remove()
    }, 300)
  }
  private initBox() {
    if (document.querySelector(`#${this.id}`)) {
      return;
    }
    this.appendHTML(
      document.body,
      `
        <div id="${this.id}" class="notification">
          <div class="notification-box">
          </div>
        </div>
      `
    );
    this.dom = document.querySelector(`#${this.id}`) as HTMLElement;
  }
  private initEvent() {
    const that = this;
    this.dom?.addEventListener(
      "click",
      function (e) {
        const target = (e.target) as any
        if(target.classList.contains('iconfont') || target.classList.contains('notification-item-close')){
          that.close(target?.parentElement.parentElement);
        }
      },
      false
    );
  }
}
