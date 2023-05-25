"use strict";
/**
 * 功能：根据参数 渲染多个可以自定义（map）点击的图片。
 * 支持页面缩放；支持自定义事件、复制功能、链接跳转功能
 **/
class Overlay {
    constructor(options) {
        this.dom = null;
        this.index = 0;
        this.click = undefined;
        if (options) {
            this.index = options["z-index"] || 2000;
            this.click = options.click;
        }
        this.init();
    }
    open() {
        var _a, _b, _c;
        this.index++;
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.classList.add("overlay-show");
        (_b = this.dom) === null || _b === void 0 ? void 0 : _b.setAttribute("z-index", this.index.toString());
        if (this.click) {
            (_c = this.dom) === null || _c === void 0 ? void 0 : _c.addEventListener("click", this.click);
        }
        document.body.style.overflow = "hidden";
        document.addEventListener("touchmove", this.mo, false); //禁止页面滑动
    }
    close() {
        var _a;
        (_a = this.dom) === null || _a === void 0 ? void 0 : _a.classList.remove("overlay-show");
        document.body.style.overflow = ""; //出现滚动条
        document.removeEventListener("touchmove", this.mo, false);
    }
    createName(base) {
        return base + "-" + Utils.guid();
    }
    mo(e) {
        e.preventDefault();
    }
    init() {
        const div = document.createElement("div");
        div.id = this.createName("overlay");
        div.classList.add("overlay");
        document.body.appendChild(div);
        this.dom = div;
    }
}
