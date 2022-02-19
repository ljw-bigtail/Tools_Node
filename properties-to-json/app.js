var fs = require("fs");

function unique(arr){            
  for(var i=0; i<arr.length; i++){
      for(var j=i+1; j<arr.length; j++){
          if(arr[i].key==arr[j].key){         //第一个等同于第二个，splice方法删除第二个
              arr.splice(j,1);
              j--;
          }
      }
  }
}

function toStr(errs){
  var err = []
  errs.map(e=>{
    err.push(`调用时增加[_value] -- ${e.key} = ${e.value}`)
  })
  return err
}

fs.readdir("./properties",function(err, files){
  if (err) {
    return console.error(err);
  }
  let errs = []
  
  files.forEach( function (file){
    // if(file != 'message_zh.properties'){
    //   return
    // }
    // console.log(`--------处理${file}文件-------------`)
    var fileData = loadFile('./properties/' + file)
    var { json, err, err_data } = getJSON(fileData)
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    // console.log(err_data);
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    writeJSON(json, './json/' + file.replace(/message_/, '').replace(/.properties/, '.json'))
    errs = errs.concat(err_data)
    if(err.length == 0){
      fs.unlink('./err/' + file.replace(/.properties/, '.txt'),  function(err) {
        // if (err) {console.log(err);}
      });
    }else{
      writeErr(err, './err/' + file.replace(/.properties/, '.txt'))
    }
  });

  unique(errs)
  writeErr(toStr(errs), './err/totle.txt')
});

function loadFile(src){
  var data = fs.readFileSync(src);
  var num = 0
  var __data = []
  // 解析数据 获得数组
  data.toString().split('\n').map(e=>{
    if(e.trim() != ''){
      var _data = e.split('=')
      if(_data.length > 2){
        _data = [_data[0],_data.slice(1, _data.length).join('=')]
      }
      if(_data.length == 2){
        var keyData = _data[0].split('.')
        num = Math.max(keyData.length, num)
        __data.push({
          keys: keyData,
          val: _data[1]
        })
      }else {
        // console.log(e)
      }
    }
  })
  return __data
}

function getJSON(data){
  var json = {}
  var err = []  // 不符合json格式的数据，需要手动处理数据格式还有对应调用处
  var err_data = []
  data.map((e, i)=>{
    var json_full_str = 'json' // 执行赋值的str
    var check_str = 'json' // 检测格式的str
  
    for (let j = 0; j < e.keys.length; j++) {
      // 拼
      json_full_str += `["${e.keys[j]}"]`
  
      // 检查并插入
      var key = e.keys[j];
      var _json = eval(check_str)
      
      if(_json){
        if(!_json.hasOwnProperty(key)){
          _json[key] = {}
        }else{
          if(typeof _json[key] == 'string'){
            err_data.push({
              key: json_full_str,
              value: _json[key]
            })

            _json[key] = {
              "_value": _json[key]
            }
          }
        }
      }
      check_str += `["${key}"]`
    }
  
    json_full_str += `='${e.val.replace(/\'/g,"@#@")}'`
    json_full_str = json_full_str.replace(/\r/g, '') // 估计是mac和win的换行符不一致
    try{
      var _str = supportPlaceholder(json_full_str)
      eval(_str)
      // 修正 @#@
      // console.log(json_full_str, 'json_full_str');
      var key = _str.split('=')[0]
      var key1 = json_full_str.split('=')[0]
      if(e.val.indexOf('\'') !== -1){
        eval(`${key}="${eval(key).replace(/@#@/g,"'").replace(/\"/g,"\\\"")}"`)
      }
      // check 去掉空值
      if(JSON.stringify(eval(key1)) == '{}'){
        // console.log(key,"key");
        eval(`delete ${key1}`)
      }
    }catch(e){
      // 异常数据
      console.log(json_full_str, e, 'err2');
      err.push(json_full_str)
      // err_data.push(e)
    }
  })

  // 异常数据再处理
  err.map(e=>{
    var data = e.split('"]=');
    var key = data[0], val = data[1].replace(/@#@/g, "\\'");
    var num_str = '{0}'
    eval(`${key}${num_str}"]=${val}`)
    // check 去掉空值
    if(JSON.stringify(eval(key + '"]')) == '{}'){
      eval(`delete ${key + '"]'}`)
    }
  })  

  return {
    json,
    err,
    err_data
  }
}

// 处理占位符, egg
// 原数据 "presaleDeliveryTime": "在 {{presaleDays}} 天內發送。"
// 目标数据  "presaleDeliveryTime{0}": "在 {0} 天內發送。"
function supportPlaceholder(str){
  // 处理数据
  var data = str.match(/{{([a-zA-Z])*}}/g)
  if(!data){
    data = str.match(/{([a-zA-Z])*}/g)
  }
  if(data){
    var keys = str.match(/\[\"([a-zA-Z0-9])*\"\]/g)
    var last = keys[keys.length - 1]
    var lastKey = last.replace(/(\[|\]|\")/g, '')
    var lastRegVal = last.replace(/\[/, '\\[').replace(/\]/, '\\]').replace(/\"/, '\\"')
    var placeholder = ''
    var _str = str
    data.map((e, i)=>{
      placeholder += `{${i}}`
      _str = _str.replace(new RegExp(e), `{${i}}`) // 替换val
    })
    _str = _str.replace(new RegExp(lastRegVal), `["${lastKey}${placeholder}"]`) // 替换 末位的key

    // console.log('----------------------')
    // console.log(str, data,  _str)
    // fix 空格
    return _str.trim()
  }else{
  // fix 空格
    return str.trim()
  }
}

function writeJSON(json, src){
  let str = JSON.stringify(json,null,"\t")
  fs.writeFile(src, str,  function(err) {
    if (err) {
        return console.error(err);
    }
    console.log(`--------数据[${src}]写入成功！-------------`)
  });
}

function writeErr(data, src){
  let str = data.join('\n')
  fs.writeFile(src, str,  function(err) {
    if (err) {
        return console.error(err);
    }
    console.log(`--------异常[${src}]写入成功！-------------`)
  });
}


