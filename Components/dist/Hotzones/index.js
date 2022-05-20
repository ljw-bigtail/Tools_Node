"use strict";
/**
 * 功能：根据参数 渲染多个可以自定义（map）点击的图片。
 * 支持页面缩放；支持自定义事件、复制功能、链接跳转功能
**/
class Hotzones {
    constructor(data, options) {
        this.appendHTML = ElementsUtils.appendHTML;
        this.dom = document.querySelector(options.domSelector);
        this.data = data;
        this.options = options;
        this.init();
    }
    init() {
        this.initDom();
        this.reloadCoords();
        this.initEvent();
    }
    initDom() {
        // 插入dom
        this.getElement().forEach((item) => {
            this.appendHTML(this.dom, item);
        });
    }
    getElement() {
        const options = this.options.shape || 'default';
        // 数组生成dom
        return this.data.map(function (item, i) {
            Hotzones.uuid++;
            let areasHtml = '';
            item.area.forEach(function (_item, j) {
                var _a, _b;
                const shape = _item.shape || options;
                areasHtml += `<area shape="${shape}" coords="${(_item.coords.join(','))}" data-index="${i},${j}" href="${((_a = _item.hrefHotzoneOptions) === null || _a === void 0 ? void 0 : _a.url) || 'javascript:void(0)'}" target="${((_b = _item.hrefHotzoneOptions) === null || _b === void 0 ? void 0 : _b.target) || ''}">`;
            });
            return `
        <div data-index="${i}" class="hotzone-item">
          <img src="${item.img.src}" usemap="#hotzone-map-${Hotzones.uuid}" alt="${item.img.alt || ''}" class="hotzone-item-img" style="width: 100%">
          <map name="hotzone-map-${Hotzones.uuid}" id="hotzone-map-${Hotzones.uuid}">${areasHtml}</map>
        </div>
      `;
        });
    }
    initEvent() {
        // 事件
        const area_elements = Array.from(this.dom.querySelectorAll('.hotzone-item area'));
        const that = this;
        area_elements.forEach((element) => {
            element.onclick = function (e) {
                const areaData = that.getAreaData(e.target);
                if (!areaData)
                    return;
                const type = areaData.type || that.options.type || 'href';
                if (type == 'copy') {
                    that.copy(areaData.copyVal, that.options.callback);
                }
                else if (type == 'click') {
                    that.options.callback && that.options.callback(areaData.data);
                }
            };
        });
        // 重载dom
        window.onresize = this.debounce(this.reloadCoords, 500);
    }
    getAreaData(area_item) {
        const index = area_item.getAttribute('data-index');
        const index_data = index.split(',').map(e => parseInt(e));
        if (index_data.length != 2)
            return;
        if (!this.data[index_data[0]] || !this.data[index_data[0]].area[index_data[1]])
            return;
        return this.data[index_data[0]].area[index_data[1]];
    }
    setCoords(hotzone_element, scale) {
        const area_elements = Array.from(hotzone_element.querySelectorAll('area'));
        const that = this;
        area_elements.forEach((area_item) => {
            const areaData = that.getAreaData(area_item);
            if (!areaData)
                return;
            const coords_data = areaData.coords.map((coords_item) => {
                return coords_item * scale;
            });
            // 设置新热区位置
            area_item.setAttribute('coords', coords_data.join());
        });
    }
    reloadCoords() {
        const that = this;
        const hotzone_elements = Array.from(this.dom.querySelectorAll('.hotzone-item'));
        hotzone_elements.forEach(function (hotzone_element) {
            const index = parseInt(hotzone_element.getAttribute('data-index'));
            that.setCoords(hotzone_element, hotzone_element.offsetWidth / that.data[index].img.width);
        });
    }
    debounce(fn, wait) {
        let timer = null;
        return () => {
            let context = this;
            let args = Array.from(arguments);
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, wait);
        };
    }
    copy(val, callback) {
        if (!val)
            return;
        if (document.execCommand('copy')) {
            let input = document.createElement('input');
            input.setAttribute('readonly', 'readonly');
            input.setAttribute('value', val);
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, val.length); // 处理iOS兼容
            document.execCommand('copy');
            callback && callback('copy success');
            document.body.removeChild(input);
        }
        else {
            navigator.clipboard.writeText(val).then(function () {
                callback && callback('copy success');
            });
        }
    }
}
Hotzones.uuid = 0; // 唯一id
