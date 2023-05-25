"use strict";
/**
 * 功能：DOM的工具类。
**/
const ElementsUtils = {
    // 插入一段html
    appendHTML(ele, html, site) {
        let div = document.createElement("div"), nodes, fragment = document.createDocumentFragment();
        div.innerHTML = html;
        nodes = div.childNodes;
        for (let i = 0, len = nodes.length; i < len; i++) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        !site || site !== "before" ? ele.appendChild(fragment) : ele.insertBefore(fragment, ele.firstChild);
        // 回收内存
        nodes = null;
        fragment = null;
    }
};
