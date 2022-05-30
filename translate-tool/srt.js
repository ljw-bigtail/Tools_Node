const fs = require("fs")
const translateArr = require("./src/api/taranslate-baidu-api")

const fileName = 'Build and Deploy a Modern Web 3.0 Blockchain App | Solidity, Smart Contracts, Crypto.srt'

fs.readFile('./file/' + fileName, 'utf-8', function (err, str) {
  if (err) {
    console.log(err, 'err');
  } else {
    let arr = []
    str.split('\n\n').forEach(item => {
      arr.push(item.split('\n'))
    });
    translateArr(arr.map(item => item[2]))
      .then(res => mixLangs(res, arr))
      .then(res => arrToSRT(res))
      .then(res => fs.writeFile('./end/' + fileName, res, err => {
        if (err) {
          console.log(err, 'writeFile error');
          return
        }
        console.log('\nwriteFile success');
      }))
      .catch(err => console.log(err, 'err'))
  }
})

function arrToSRT(arr) {
  return arr.map(item => {
    return item.join('\n')
  }).join('\n\n')
}

function mixLangs(arr_cn, arr_en) {
  return arr_en.map((item, index) => {
    item[2] = arr_cn[index]
    return item
  })
}
