/**
 * 功能：根据参数 渲染多个可以自定义（map）点击的图片。
 * 支持页面缩放；支持自定义事件、复制功能、链接跳转功能
 **/

interface OverlayOptions {
  "z-index": number;
  click?: () => {};
}

class Overlay {
  private dom: HTMLElement | null;
  private index: number;
  private click?: ()=>void;
  constructor(options: OverlayOptions) {
    this.dom = null;
    this.index = 0;
    this.click = undefined;
    if(options){
      this.index = options["z-index"] || 2000
      this.click = options.click
    }
    this.init();
  }
  open() {
    this.index++;
    this.dom?.classList.add("overlay-show");
    this.dom?.setAttribute("z-index", this.index.toString());
    if (this.click) {
      this.dom?.addEventListener("click", this.click);
    }
    document.body.style.overflow = "hidden";
    document.addEventListener("touchmove", this.mo, false); //禁止页面滑动
  }
  close() {
    this.dom?.classList.remove("overlay-show");
    document.body.style.overflow = ""; //出现滚动条
    document.removeEventListener("touchmove", this.mo, false);
  }
  private createName(base: string) {
    return base + "-" + Utils.guid();
  }
  private mo(e: Event) {
    e.preventDefault();
  }
  private init() {
    const div = document.createElement("div");
    div.id = this.createName("overlay");
    div.classList.add("overlay");
    document.body.appendChild(div);
    this.dom = div
  }
}
