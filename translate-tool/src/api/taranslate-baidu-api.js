const crypto = require("crypto")
const axios = require("axios");
const LogProgressBar = require('../tool/log-progress-bar')
const pb = new LogProgressBar('翻译进度');

const baiduApi = 'https://fanyi-api.baidu.com/api/trans/vip/translate',
  appid = "20220530001233746",
  key = "btjTvCeuWBzTO2dnlaTg",
  waitTime = 1000;

function getRadom(len) {
  var chart = '1234567890',
    value = '';
  for (let i = 0; i < len; i++) {
    value += chart.charAt(Math.floor(Math.random() * chart.length))
  }
  return value
}

function hash(method, s, format) {
  var sum = crypto.createHash(method)
  var isBuff = Buffer.isBuffer(s)
  if (!isBuff && typeof s == 'object') {
    s = JSON.stringify(s)
  }
  sum.update(s, isBuff ? 'binary' : 'utf8')
  return sum.digest(format || 'hex')
}

function md5(s, format) {
  return hash('md5', s, format)
}

// 请求队列
const generate = (p) => {
  p = p || Promise;
  return function (condition, action, ctx) {
    var whilst = function (data) {
      try {
        if (ctx == null) ctx = this;
        if (!condition.call(ctx, data)) return p.resolve(data);
        return p.resolve(action.call(ctx, data)).then(whilst);
      } catch (e) {
        return p.reject(e);
      }
    };
    return whilst();
  };
}

function translateArr(data) {
  let whileSend = generate();
  let arr = [];
  let index = 0;
  let len = data.length
  return whileSend(() => {
    return !(arr.length === len);
  }, async () => {
    const str = await waitForOnce(data[index])
    index++
    arr.push(str)
    pb.render({
      completed: index,
      total: len
    });
  }).then(() => {
    return arr
  })
  
}

async function waitForOnce(q){
  return await new Promise(function(res){
    setTimeout(function(){
      var str = getOnce(q)
      res(str)
    }, waitTime)
  })
}

async function getOnce(q) {
  const salt = getRadom(8);
  const params = {
    "from": "en",
    "to": "zh",
    q,
    appid,
    salt,
    "sign": md5(`${appid}${q}${salt}${key}`),
  }
  const ajax = await axios.get(baiduApi, {
    params
  })
  if(ajax.data.error_code){
    throw new Error(`--------\n接口异常：${ajax.data.error_code}; \n查询字段：${q}\n--------`)
  }
  return ajax.data.trans_result[0].dst
}

module.exports = translateArr