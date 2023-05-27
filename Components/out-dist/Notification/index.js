"use strict";
/**
 * 功能：弹框。
 * 支持预设尺寸
 **/
class Notifications {
    constructor(options) {
        this.appendHTML = ElementsUtils.appendHTML;
        this.id = 'common_notificationOptions_box';
        this.dom = null;
        this.keep = options.keep || 8000;
        this.init();
    }
    init() {
        this.initBox();
        this.initEvent();
    }
    add(data) {
        var _a;
        const that = this;
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.classList.add("open");
        const dom_item = this.renderItem(data);
        setTimeout(function () {
            dom_item === null || dom_item === void 0 ? void 0 : dom_item.classList.add('open');
        }, 100);
        if (!dom_item)
            return;
        var timer = null;
        if (this.keep >= 0) {
            (function (item) {
                timer = setTimeout(function () {
                    item.remove();
                }, that.keep);
            })(dom_item);
        }
        dom_item.addEventListener('mouseover', function () {
            timer && clearTimeout(timer);
        });
        return function () {
            that.close(dom_item);
        };
    }
    renderItem(item) {
        var _a;
        const dom = ((_a = this.dom) === null || _a === void 0 ? void 0 : _a.querySelector('.notification-box'));
        if (!dom)
            return;
        this.appendHTML(dom, `
        <div class="notification-item">
          <div class="notification-item-close"><span class="iconfont">×</span></div>
          ${item.header ? `<div class="notification-item-header">${item.header}</div>` : ''}
          <div class="notification-item-content">${item.content}</div>
          ${item.footer ? `<div class="notification-item-footer">${item.footer}</div>` : ''}
        </div>
      `);
        return dom.children[dom.children.length - 1];
    }
    destory() {
        var _a;
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.remove();
    }
    close(item) {
        item.classList.remove("open");
        setTimeout(function () {
            item.remove();
        }, 300);
    }
    initBox() {
        if (document.querySelector(`#${this.id}`)) {
            return;
        }
        this.appendHTML(document.body, `
        <div id="${this.id}" class="notification">
          <div class="notification-box">
          </div>
        </div>
      `);
        this.dom = document.querySelector(`#${this.id}`);
    }
    initEvent() {
        var _a;
        const that = this;
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (e) {
            const target = (e.target);
            if (target.classList.contains('iconfont') || target.classList.contains('notification-item-close')) {
                that.close(target === null || target === void 0 ? void 0 : target.parentElement.parentElement);
            }
        }, false);
    }
}
