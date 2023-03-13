"use strict";

var tencentcloud = require("tencentcloud-sdk-nodejs");

var LogProgressBar = require("../tool/log-progress-bar");

var Cache = require("../tool/cache");

var pb = new LogProgressBar("翻译进度");
var TmtClient = tencentcloud.tmt.v20180321.Client;

var config = require("../../api-key");

var _config$tencent = config.tencent,
    secretId = _config$tencent.secretId,
    secretKey = _config$tencent.secretKey,
    ProjectId = _config$tencent.ProjectId,
    waitTime = _config$tencent.waitTime;
var client = new TmtClient({
  credential: {
    secretId: secretId,
    secretKey: secretKey
  },
  region: "ap-chongqing",
  profile: {
    httpProfile: {
      endpoint: "tmt.tencentcloudapi.com"
    }
  }
}); // 请求队列

var generate = function generate(p) {
  p = p || Promise;
  return function (condition, action, ctx) {
    var whilst = function whilst(data) {
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
  var whileSend = generate();
  var arr = [];
  var index = 0;
  var len = data.length;
  var pause = false;
  return whileSend(function () {
    return !(arr.length === len || pause);
  }, function _callee() {
    var str;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(waitForOnce(data[index]));

          case 2:
            str = _context.sent;

            if (!(str == null)) {
              _context.next = 8;
              break;
            }

            pause = true;
            Cache.set({
              index: index
            });
            console.log("\n意外退出，暂存：" + index + "\n--------");
            return _context.abrupt("return");

          case 8:
            index++;
            arr.push(str);
            pb.render({
              completed: index,
              total: len
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    });
  }).then(function () {
    return arr;
  })["catch"](function (err) {
    // pause = true
    // Cache.set({
    //   index
    // })
    console.log("\n接口异常，暂存：" + index + "\n--------");
  });
}

function waitForOnce(q) {
  return regeneratorRuntime.async(function waitForOnce$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (res) {
            setTimeout(function () {
              var str = getOnce(q);
              res(str);
            }, waitTime);
          }));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getOnce(q) {
  var ajax;
  return regeneratorRuntime.async(function getOnce$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(client.TextTranslate({
            SourceText: q,
            Source: "en",
            Target: "zh",
            ProjectId: ProjectId
          }));

        case 2:
          ajax = _context3.sent;

          if (!ajax.Error) {
            _context3.next = 6;
            break;
          }

          // TODO 断点续传
          // 先保存 然后分析数据 从当前位置再次执行
          // throw new Error(`--------\n接口异常：${ajax.data.error_code}; \n查询字段：${q}\n--------`)
          console.log("--------\n\u63A5\u53E3\u5F02\u5E38\uFF1A".concat(ajax.Error.Message, "; \n\u67E5\u8BE2\u5B57\u6BB5\uFF1A").concat(q));
          return _context3.abrupt("return", null);

        case 6:
          return _context3.abrupt("return", ajax.TargetText);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}

module.exports = translateArr;