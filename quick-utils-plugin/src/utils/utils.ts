/**
 * localStorage
 */
export const Cache = {
  get: (key: string)=>{
    const json = window.localStorage.getItem(key)
    return json ? JSON.parse(json) : {}
  },
  set: (key: string, value: {})=>{
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string)=>{
    window.localStorage.removeItem(key)
  },
  clear: ()=>{
    window.localStorage.clear()
  }
}

/**
 * 节流
 * 函数在一定时间内只能执行一次
 */

// 回调函数的类型
type ReFn = (...args:any) => void
// 节流函数的类型
type ThFn = (fn: ReFn, timer?: number) => ReFn
export const throttle: ThFn = (fn, timer:undefined | number = 50) => {
  let time: any = null
  const _throttle = (...args:any) => {
    if (time) clearTimeout(time)
    time = setTimeout(() => {
        fn.apply(this,args)
    }, timer);
  }
  return _throttle
}


export const ElementsUtils = {
  // 插入一段html
  appendHTML(ele: HTMLElement|Element, html: string, site?: "before" | "after"): void{
    let div: HTMLElement = document.createElement("div"),
        nodes: NodeListOf<ChildNode>,
        fragment: DocumentFragment = document.createDocumentFragment();
    div.innerHTML = html;
    nodes = div.childNodes;
    for(let i = 0,len = nodes.length; i < len; i++){
      fragment.appendChild(nodes[i].cloneNode(true));
    }
    !site || site !== "before" ? ele.appendChild(fragment) : ele.insertBefore(fragment, ele.firstChild);
    // 回收内存
    nodes = (null as unknown) as NodeListOf<ChildNode>;
    fragment = (null as unknown) as DocumentFragment;
  },
  // 事件委托
  delegateEvent(element: HTMLElement, eventType: string, selector: string, handler: (event: Event) => void) {
    element.addEventListener(eventType, function(event) {
      let target = event.target as HTMLElement;
      while (target && target !== element) {
        if (target.matches(selector)) {
          handler.call(target, event);
          break;
        }
        if(target.parentElement){
          target = target.parentElement;
        }
      }
    });
  },
  // 向上查找父级
  parents(element: HTMLElement, selector: string): HTMLElement[] {
    const parents: HTMLElement[] = [];
    let currentElement: HTMLElement | null = element.parentElement;
    while (currentElement) {
      if (!selector || currentElement.matches(selector)) {
        parents.push(currentElement);
      }
      currentElement = currentElement.parentElement;
    }
    return parents;
  }

}

export const copy = async function(text: string){
  return new Promise((resolve) => {
    if ('clipboard' in navigator) {
      const clipboard = navigator.clipboard;
      // 复制文本到剪贴板
      clipboard.writeText(text)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        });
    }else{
      resolve(false)
    }
  })
}