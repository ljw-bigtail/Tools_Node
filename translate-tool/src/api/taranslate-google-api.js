const translate = require('@iamtraction/google-translate');
const LogProgressBar = require("../tool/log-progress-bar");
const Cache = require("../tool/cache");
const pb = new LogProgressBar("翻译进度");

const config = require("../../api-key");
const { waitTime } = config.googlefree;

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
};

function translateArr(data) {
  let whileSend = generate();
  let arr = [];
  let index = 0;
  let len = data.length;
  let pause = false;
  return whileSend(
    () => {
      return !(arr.length === len || pause);
    },
    async () => {
      const str = await waitForOnce(data[index]);
      if (str == null) {
        pause = true;
        Cache.set({
          index,
        });
        console.log("\n意外退出，暂存：" + index + "\n--------");
        return;
      }
      index++;
      arr.push(str);
      pb.render({
        completed: index,
        total: len,
      });
    }
  )
    .then(() => {
      return arr;
    })
    .catch((err) => {
      // pause = true
      // Cache.set({
      //   index
      // })
      console.log("\n接口异常，暂存：" + index + "\n--------");
    });
}

async function waitForOnce(q) {
  return await new Promise(function (res) {
    setTimeout(function () {
      var str = getOnce(q);
      res(str);
    }, waitTime);
  });
}

async function getOnce(q) {
  try{
    const ajax = await translate(q, {
      from: 'en',
      to: 'nl'
    })
    return ajax.text;
  }catch(err){
    console.log(`--------\n接口异常：${err}; \n查询字段：${q}`);
    return null;
  }
  // {
  //   text: 'Kleur',
  //   from: {
  //     language: { didYouMean: false, iso: 'en' },
  //     text: { autoCorrected: false, value: '', didYouMean: false }
  //   },
  //   raw: ''
  // }
}

module.exports = translateArr;
