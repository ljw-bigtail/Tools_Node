const fs = require("fs");
// const translateArr = require("./src/api/taranslate-baidu-api")
// const translateArr = require("./src/api/taranslate-tencent-api")
const translateArr = require("./src/api/taranslate-google-api");
const Cache = require("./src/tool/cache");

const fileName = "en.json";

fs.readFile("./file/" + fileName, "utf-8", function (err, str) {
  if (err) {
    console.log(err, "err");
    return;
  }
  try {
    fs.readFileSync("./end/" + fileName, "utf-8");
    run(str);
  } catch (error) {
    fs.writeFile("./end/" + fileName, "", function () {
      run(str);
    });
  }
});

// api test
// translateArr(["test", 'word'])

function run(str) {
  let json = jsonFlatten(JSON.parse(str));
  let arr = Object.keys(json).map(key => {
    return [key, json[key]]
  })
  var pauseIndex = Cache.get().index;
  if (typeof pauseIndex == "number") {
    arr = arr.slice(pauseIndex, -1);
  }

  translateArr(arr.map(item => item[1]))
    .then(res => mixLangs(res, arr))
    .then((res) => readCache(res, pauseIndex))
    .then((res) => arrToJson(res))
    .then((res) => {
      fs.writeFile("./end/" + fileName, res, (err) => {
        if (err) {
          console.log(err, "writeFile error");
          return;
        }
        console.log("\nwriteFile success");
      });
    })
    .catch((err) => console.log(err, "err"));
}

function readCache(res, pauseIndex) {
  if (typeof pauseIndex == "number") {
    const cachData = srtToJson(fs.readFileSync("./end/" + fileName, "utf-8"));
    res = cachData.concat(res);
    Cache.clear();
  }
  return res;
}

function arrToJson(arr) {
  const json = {}
  arr.map(item=>{
    json[item[0]] = item[1]
  })
  return JSON.stringify(unflatten(json), null, 2)
}

function mixLangs(arr_cn, arr_en) {
  return arr_en.map((item, index) => {
    return [
      item[0],
      arr_cn[index]
    ]
  })
}

 function unflatten(data) {
  if (Object(data) !== data || Array.isArray(data))
      return data;
  var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
      resultholder = {};
  for (var p in data) {
      var cur = resultholder,
          prop = "",
          m;
      while (m = regex.exec(p)) {
          cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
          prop = m[2] || m[1];
      }
      cur[prop] = data[p];
  }
  return resultholder[""] || resultholder;
};

function jsonFlatten(data) {
  let result = {};
  function deepTraverse(obj, path) {
    if (obj !== Object(obj)) {
      result[path] = obj;
      return;
    }
    // 数组对象，如果前缀路径保证正确，拼接上下标访问符即可
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        deepTraverse(obj[i], path + "[" + i + "]");
      }
      return;
    }
    // json对象
    for (let i in obj) {
      if (path !== "") {
        deepTraverse(obj[i], path + "." + i);
      } else {
        deepTraverse(obj[i], i);
      }
    }
  }
  if (data !== Object(data)) {
    return data;
  }
  deepTraverse(data, "");
  return result;
};
