class VirtualList{
  constructor(option){
    this.options = {
      data: option.data, // 虚拟dom对应的数组
      size: option.size, // size
      domSelecter: option.id ? ("#" + option.id) : 'body', // list box id
      template: option.template, // node function(item) 返回自定义 item
      advance: option.advance ? this.option.advance : 80, // 距离底部 80px 就认为到了底部
    }
    this.$box = document.querySelector(this.options.domSelecter); // 盒子
    this.$ = this.getUl(); // 列表
    this.qty = this.getStep(); // 每页显示数量
    this.index = this.getIndex(); // 当前滚动到那个node
    this.scrollTop = 0; // 当前滚动距离
    this.nodeHeight = this.getNodeHeight(); // 获取node的高度
    this.init()
  }
  init(){
    // 初始化项目
    console.log(this.options.data, 'list', this.nodeHeight, 'nodeHeight')
    console.time('render dom')
    this.initHtml()
    console.timeEnd('render dom')
    console.log('~~~~~~~~~~~~~');
    this.initEvent()
  }
  nodeTemplate(index){
    const item = this.options.data[index]
    const temp = this.options.template ? this.options.template(item, index) : item
    return `<li data-index="${index}">${temp}</li>`
  }
  getIndex(){
    // 根据当前滚动的位置
    // return this.$.scrollTop > 0 ? this.getscrollNodeQty(this.$.scrollTop) : 0
    return 0
  }
  getNodeHeight(){
    this.appendHtml(`<ul id="hiddenBox" style="position: absolute; top: -100%; left: -100%; visibility: hidden;">${this.nodeTemplate(0)}</ul>`, -1, this.$box)
    const node = this.$box.querySelector('#hiddenBox')
    const nodeHeight = node.clientHeight
    this.$box.removeChild(node)
    return nodeHeight
  }
  getscrollNodeQty(scrollDistance){
    return parseInt(scrollDistance / this.nodeHeight) + 1
  }
  getStep(){
    if(this.options.size == 'auto'){
      // TODO 根据dom（带样式的） 获取node的高度，计算得出一页需要多少node数量
      // 思路 先插入一个node 然后获取高度 然后进行计算
      
      return 10
    }else{
      return this.options.size
    }
  }
  getUl(){
    // 初始化 列表
    this.$box.innerHTML = '<ul></ul>'
    return this.$box.querySelector('ul')
  }
  initHtml(){
    // 更新node
    // this.updateHtml(0)
    this.updateHtml(this.index)
  }
  appendHtml(html, index = -1, $){
    const dom = $ ? $ : this.$
    // 插入dom
    let divTemp = document.createElement("div"),
        nodes = null, // 文档片段，一次性append，提高性能
        fragment = document.createDocumentFragment(); // 避免引起dom回流
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;
    for (var i=0, length=nodes.length; i<length; i+=1) {
      fragment.appendChild(nodes[i].cloneNode(true));
    }
    if(dom.hasChildNodes() && index > -1){
      dom.insertBefore(fragment, dom.childNodes[index + 1]);
    }else{ 
      dom.appendChild(fragment);
    }
  }
  addNode(index_interval, position_index = -1){
    // 插入dom
    let html = ''
    if(!index_interval || index_interval.length != 2){}
    for (let index = index_interval[0]; index < index_interval[1]; index++) {
      html += this.nodeTemplate(index)
    }
    console.log(index_interval, 'index_interval', position_index, 'position_index');
    this.appendHtml(html, position_index)
  }
  delNode(index = 0, length = 1){
    // this.delNode(1, 3)
    // 删除dom
    if(this.$.hasChildNodes()){
      for (let i = length; i > 0; i--) {
        const rm_node = index > 0 && index < this.options.data.length ? this.$.childNodes[index] : this.$.lastChild
        this.$.removeChild(rm_node)
      }
    }
  }
  refreshHtml(){
    // 删除多余的dom 添加新的dom

  }
  debounce(fn, wait = 0){
    // 防抖
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }
  scrollEvent(e){
    const scrollTop = e.target.scrollingElement.scrollTop
    if(scrollTop == this.scrollTop){ return console.log('没滚动') && false;}
    let scrollDistance = Math.abs(scrollTop - this.scrollTop)
    let scrollQty = this.getscrollNodeQty(scrollDistance)
    if(scrollTop > this.scrollTop){
      // 向下滚动
      console.log('向下滚动', scrollDistance, scrollQty);
      // this.updateHtml(scrollQty)
      this.updateHtml(undefined, scrollQty)
      // if(scrollTop + this.options.advance + window.innerHeight >= e.target.scrollingElement.scrollHeight){
      //   // 滚动到底部
      //   console.log('滚动到底部');
      // }
    }else{
      console.log('向上滚动', scrollDistance, scrollQty);
      // 向上滚动
    }
    this.scrollTop = scrollTop
  }
  initEvent(){
    // 初始化事件
    const that = this
    this.$box.onscroll = this.debounce(e=>{ that.scrollEvent(e) }, 1000)
  }
  updateHtml(start_index = this.index, page_length = this.qty){
    // 从第index个 渲染下一页数据
    let end_index = start_index + page_length
    if(end_index > this.options.data.length){
      console.error('updateHtml index参数超出范围(大)。');
      end_index = this.options.data.length
    }
    // const old_index = this.index
    // const index_interval = [i, i+this.qty > this.options.data.length ? this.options.data.length : i+this.qty]
    // const index_interval = this.getIndexInterval(index)
    if(start_index == end_index){
      console.log('数据加载完了。');
      return
    }
    const index_interval = [start_index, end_index]
    this.addNode(index_interval)
    this.index = end_index
  }
}