/**
 * 功能：弹框。
 * 支持预设尺寸
 **/

type DialogSize = "xxl" | "xl" | "m" | "xs" | "xxs" | "auto" | "notification";

interface DialogOptions {
  id: string;
  size?: DialogSize;
  needClose?: boolean;
  header?: string;
  content: string;
  footer?: string;
  onOpen?: Function;
  onClose?: Function;
  defaultContentData: any;
  contentRender?: Function;
}

class Dialogs {
  dom: HTMLElement | null;
  isInit: boolean;
  options: DialogOptions;
  constructor(options: DialogOptions) {
    this.dom = null;
    this.isInit = false;
    this.options = options;

    this.init();
  }
  private appendHTML = ElementsUtils.appendHTML;
  init() {
    if (this.options.id === "") {
      console.error("Dialog 初始化异常，请检查参数。");
      return false;
    }
    this.isInit = true;
    this.initBox();
    this.initEvent();
  }
  close() {
    // OverlayMask.close()
    this.dom?.classList.remove("open");
    this.options.onClose && this.options.onClose();
  }
  open(isRefresh: boolean) {
    if (!this.isInit) {
      this.init();
    }
    // OverlayMask.open(8000)
    this.dom?.classList.add("open");
    this.options.onOpen && this.options.onOpen();
  }
  fresh(contentData: any) {
    if (
      !this.options.contentRender ||
      typeof this.options.contentRender !== "function"
    ) {
      return;
    }
    const content = this.dom?.querySelector(".dialog-content");
    if (!content) {
      return;
    }
    content.innerHTML = this.options.contentRender(contentData);
  }
  destory() {
    this.dom?.remove();
  }
  loading(state: boolean) {
    if (state === undefined || !!state) {
      this.dom?.querySelector(".dialog-loading")?.classList.add("show");
    } else {
      this.dom?.querySelector(".dialog-loading")?.classList.remove("show");
    }
  }
  private initBox() {
    if (document.querySelector(`#${this.options.id}`)) {
      return;
    }
    // if (!window.OverlayMask) {
    //   window.OverlayMask = new Overlay() // 标准遮罩层 初始化
    // }
    // contentRender
    // defaultContentData
    let contentHtml = "";
    if (this.options.content) {
      contentHtml = this.options.content;
    } else if (
      this.options.contentRender &&
      typeof this.options.contentRender === "function" &&
      this.options.defaultContentData
    ) {
      contentHtml = this.options.contentRender(this.options.defaultContentData);
    }
    const needCloseHtml = this.options.needClose
      ? '<div class="dialog-close"><span class="iconfont">×</span></div>'
      : "";
    const headerHtml = this.options.header
      ? `<div class="dialog-header">${this.options.header}</div>`
      : "";
    const footerHtml = this.options.footer
      ? `<div class="dialog-footer">${this.options.footer}</div>`
      : "";

    this.appendHTML(
      document.body,
      `
      <div id="${this.options.id}" class="dialog dialog-${
        this.options.size || "auto"
      }">
        <div class="dialog-loading global-loading"><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div></div>
        <div class="dialog-center-box">
          ${needCloseHtml}
          ${headerHtml}
          <div class="dialog-content">${contentHtml}</div>
          ${footerHtml}
        </div>
      </div>
    `
    );

    this.dom = document.querySelector(`#${this.options.id}`) as HTMLElement;
    console.log(this.dom);
  }
  private initEvent() {
    const that = this;
    this.dom?.addEventListener('click', function(e){
      e.stopPropagation()
      return false
    })
    document.body.addEventListener(
      "click",
      function () {
        that.close();
      },
      false
    );
    this.dom?.querySelector(".dialog-close")?.addEventListener(
      "click",
      function () {
        that.close();
      },
      false
    );
  }
}
