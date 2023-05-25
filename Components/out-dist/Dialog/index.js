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
        this.options = options;
        this.init();
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
        // OverlayMask.close()
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.classList.remove("open");
        this.options.onClose && this.options.onClose();
    }
    open(isRefresh) {
        var _a;
        if (!this.isInit) {
            this.init();
        }
        // OverlayMask.open(8000)
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.classList.add("open");
        this.options.onOpen && this.options.onOpen();
    }
    fresh(contentData) {
        var _a;
        if (!this.options.contentRender ||
            typeof this.options.contentRender !== "function") {
            return;
        }
        const content = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.querySelector(".dialog-content");
        if (!content) {
            return;
        }
        content.innerHTML = this.options.contentRender(contentData);
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
        // contentRender
        // defaultContentData
        let contentHtml = "";
        if (this.options.content) {
            contentHtml = this.options.content;
        }
        else if (this.options.contentRender &&
            typeof this.options.contentRender === "function" &&
            this.options.defaultContentData) {
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
        console.log(this.dom);
    }
    initEvent() {
        var _a, _b, _c;
        const that = this;
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
            e.stopPropagation();
            return false;
        });
        document.body.addEventListener("click", function () {
            that.close();
        }, false);
        (_c = (_b = this.dom) === null || _b === void 0 ? void 0 : _b.querySelector(".dialog-close")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
            that.close();
        }, false);
    }
}
