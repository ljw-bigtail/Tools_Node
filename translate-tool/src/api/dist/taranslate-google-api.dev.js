"use strict";

var translate = require('@iamtraction/google-translate');

var LogProgressBar = require("../tool/log-progress-bar");

var Cache = require("../tool/cache");

var pb = new LogProgressBar("翻译进度");

var config = require("../../api-key");

var waitTime = config.googlefree.waitTime; // 请求队列

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
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(translate(q, {
            from: 'en',
            to: 'nl'
          }));

        case 3:
          ajax = _context3.sent;
          return _context3.abrupt("return", ajax.text);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log("--------\n\u63A5\u53E3\u5F02\u5E38\uFF1A".concat(_context3.t0, "; \n\u67E5\u8BE2\u5B57\u6BB5\uFF1A").concat(q));
          return _context3.abrupt("return", null);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

module.exports = translateArr;