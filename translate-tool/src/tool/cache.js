const fs = require("fs")
const Cache = {
  get: function(){
    let res = null
    try{
      res = fs.readFileSync('./cache.json', 'utf-8')
    }catch(e){
      // console.log();
    }
    return res ? JSON.parse(res) : {}
  },
  set: function(json){
    fs.writeFile('./cache.json', JSON.stringify(json), function (err, str) {
      if (err) {
        console.log('\n', err, 'err');
      } else {
        console.log('\ncache success');
      }
    })
  },
  clear: function(){
    fs.writeFile('./cache.json', '', function (err, str) {
      if (err) {
        console.log('\n', err, 'err');
      } else {
        console.log('\ncache clear');
      }
    })
  }
}

module.exports = Cache