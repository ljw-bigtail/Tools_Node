const fs = require("fs")
const translateArr = require("./src/api/taranslate-baidu-api")
const Cache = require('./src/tool/cache')

const fileName = 'Build and Deploy a Modern Web 3.0 Blockchain App | Solidity, Smart Contracts, Crypto.srt'

fs.readFile('./file/' + fileName, 'utf-8', function (err, str) {
  if (err) {
    console.log(err, 'err');
  } else {
    let arr = srtToJson(str)
    var pauseIndex = Cache.get().index
    if(typeof pauseIndex == 'number'){
      arr = arr.slice(pauseIndex, -1)
    }
    translateArr(arr.map(item => item[2]))
      .then(res => mixLangs(res, arr))
      .then(res => readCache(res, pauseIndex))
      .then(res => arrToSRT(res))
      .then(res => {
        fs.writeFile('./end/' + fileName, res, err => {
          if (err) {
            console.log(err, 'writeFile error');
            return
          }
          console.log('\nwriteFile success');
        })
      })
      .catch(err => console.log(err, 'err'))
  }
})

function readCache(res, pauseIndex){
  if(typeof pauseIndex == 'number'){
    const cachData = srtToJson(fs.readFileSync('./end/' + fileName, 'utf-8'))
    res = cachData.concat(res)
    Cache.clear()
  }
  return res
}

function srtToJson(str){
  let arr = []
  str.split('\n\n').forEach(item => {
    arr.push(item.split('\n'))
  });
  return arr
}

function arrToSRT(arr) {
  console.log(arr);
  return arr.map(item => {
    return item.join('\n')
  }).join('\n\n')
}

function mixLangs(arr_cn, arr_en) {
  return arr_en.map((item, index) => {
    item[2] = arr_cn[index]
    return item
  }).filter(item => item[2])
}
