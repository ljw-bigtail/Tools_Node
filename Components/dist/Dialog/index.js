"use strict";
/**
 * 功能：弹框。
 * 支持预设尺寸
 **/
class Dialogs {
    constructor(options) {
        this.appendHTML = ElementsUtils.appendHTML;
        this.dom = null;
        this.isInit = false;
        this.isRefresh = false;
        this.options = options;
    }
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
        var _a;
        if (this.isRefresh) {
            location.reload();
        }
        // OverlayMask.close()
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.classList.remove("open");
    }
    open(isRefresh) {
        var _a;
        if (!this.isInit) {
            this.init();
        }
        this.isRefresh = isRefresh;
        // OverlayMask.open(8000)
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.classList.add("open");
    }
    destory() {
        var _a;
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.remove();
    }
    loading(state) {
        var _a, _b, _c, _d;
        if (state === undefined || !!state) {
            (_b = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.querySelector(".dialog-loading")) === null || _b === void 0 ? void 0 : _b.classList.add("show");
        }
        else {
            (_d = (_c = this.dom) === null || _c === void 0 ? void 0 : _c.querySelector(".dialog-loading")) === null || _d === void 0 ? void 0 : _d.classList.remove("show");
        }
    }
    initBox() {
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
        this.appendHTML(document.body, `
      <div id="${this.options.id}" class="dialog dialog-${this.options.size || "auto"}">
        <div class="dialog-loading global-loading"><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div><div class="global-loading-dot"></div></div>
        <div class="dialog-center-box">
          ${needCloseHtml}
          ${headerHtml}
          <div class="dialog-content">${contentHtml}</div>
          ${footerHtml}
        </div>
      </div>
    `);
        this.dom = document.querySelector(`#${this.options.id}`);
    }
    initEvent() {
        var _a, _b;
        const that = this;
        (_b = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.querySelector(".dialog-close")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
            that.close();
        }, false);
    }
}
