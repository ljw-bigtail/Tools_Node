"use strict";

var fs = require("fs"); // const translateArr = require("./src/api/taranslate-baidu-api")
// const translateArr = require("./src/api/taranslate-tencent-api")


var translateArr = require("./src/api/taranslate-google-api");

var Cache = require('./src/tool/cache');

var fileName = 'message_en.properties';
fs.readFile('./file/' + fileName, 'utf-8', function (err, str) {
  if (err) {
    console.log(err, 'err');
    return;
  }

  try {
    fs.readFileSync('./end/' + fileName, 'utf-8');
    run(str);
  } catch (error) {
    fs.writeFile('./end/' + fileName, '', function () {
      run(str);
    });
  }
}); // api test
// translateArr(["test", 'word'])

function run(str) {
  var arr = srtToJson(str);
  var pauseIndex = Cache.get().index;

  if (typeof pauseIndex == 'number') {
    arr = arr.slice(pauseIndex, -1);
  }

  translateArr(arr.map(function (item) {
    return item[1];
  })).then(function (res) {
    return mixLangs(res, arr);
  }).then(function (res) {
    return readCache(res, pauseIndex);
  }).then(function (res) {
    return arrToSRT(res);
  }).then(function (res) {
    fs.writeFile('./end/' + fileName, res, function (err) {
      if (err) {
        console.log(err, 'writeFile error');
        return;
      }

      console.log('\nwriteFile success');
    });
  })["catch"](function (err) {
    return console.log(err, 'err');
  });
}

function readCache(res, pauseIndex) {
  if (typeof pauseIndex == 'number') {
    var cachData = srtToJson(fs.readFileSync('./end/' + fileName, 'utf-8'));
    res = cachData.concat(res);
    Cache.clear();
  }

  return res;
}

function srtToJson(str) {
  var arr = [];
  str.split('\n').forEach(function (item) {
    if (item && item.indexOf('#') != 0) {
      arr.push(splitFirst(item, '='));
    }
  });
  return arr;
}

function splitFirst(str, key) {
  var arr = str.split(key);
  return [arr[0], arr.slice(1).join(key)];
}

function arrToSRT(arr) {
  return arr.map(function (item) {
    return item.join('=');
  }).join('\n');
}

function mixLangs(arr_cn, arr_en) {
  console.log(arr_cn);
  return arr_en.map(function (item, index) {
    return [item[0], arr_cn[index]];
  });
}