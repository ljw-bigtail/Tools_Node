/**
 * 功能：弹框。
 * 支持预设尺寸
 **/

type DialogSize = "xxl" | "xl" | "m" | "xs" | "xxs" | "auto";

interface DialogOptions {
  id: string;
  size?: DialogSize;
  needClose?: boolean;
  header?: string;
  content: string;
  footer?: string;
}

class Dialogs {
  dom: HTMLElement | null;
  isInit: boolean;
  isRefresh: boolean;
  options: DialogOptions;
  constructor(options: DialogOptions) {
    this.dom = null;
    this.isInit = false;
    this.isRefresh = false;
    this.options = options;
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
    if (this.isRefresh) {
      location.reload();
    }
    // OverlayMask.close()
    this.dom?.classList.remove("open");
  }
  open(isRefresh: boolean) {
    if (!this.isInit) {
      this.init();
    }
    this.isRefresh = isRefresh;
    // OverlayMask.open(8000)
    this.dom?.classList.add("open");
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
    let contentHtml = this.options.content;
    // TODO 模版拼接卸载外面就行
    // if (this.options.templateName && this.options.templateData) {
    //   if (document.querySelectorAll(`script[id="${this.options.templateName}"]`).length != 1) {
    //     console.info('Dialog 模板异常，请检查。', this.options);
    //     return
    //   }
    //   contentHtml = this.renderFunction(this.options.templateName, this.options.templateData)
    // }
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
  }
  private initEvent() {
    const that = this;
    this.dom?.querySelector(".dialog-close")?.addEventListener(
      "click",
      function () {
        that.close();
      },
      false
    );
  }
}
