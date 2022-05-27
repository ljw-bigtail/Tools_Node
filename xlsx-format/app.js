let xlsx = require('xlsx');

const config = {
  inPath: './file/',
  outPath: './end/',
}
const fileName = '派对礼服360个'
const ext = '.xlsx'

function getJson(src, sheetIndex = 0) {
  let workbook = xlsx.readFile(src); //workbook就是xls文档对象

  let sheetNames = workbook.SheetNames; //获取表明

  let sheet = workbook.Sheets[sheetNames[sheetIndex]]; //通过表明得到表对象

  return xlsx.utils.sheet_to_json(sheet); //通过工具将表对象的数据读出来并转成json
}

function jsonToXlsx(json, sheetNames) {
  let ss = xlsx.utils.json_to_sheet(json); //通过工具将json转表对象
  let keys = Object.keys(ss).sort(); //排序 [需要注意，必须从A1开始]

  let ref = keys[1] + ':' + keys[keys.length - 1]; //这个是定义一个字符串 也就是表的范围[A1:C5] 

  xlsx.writeFile({ //定义操作文档
    SheetNames: [sheetNames], //定义表明
    Sheets: {
      [sheetNames]: Object.assign({}, ss, {
        '!ref': ref
      }) //表对象[注意表明]
    },
  }, config.outPath + fileName + '-format' + ext); //将数据写入文件
}

var data = getJson(config.inPath + fileName + ext, 1)
// var data = getJson(config.inPath + fileName, 1).slice(0, 30)

// 逻辑代码
let resData = []
let skuCache = {}
for (let i = 1; i < data.length; i++) {
  const row = data[i];
  if(row['商品spu'] && row['商品spu'] != skuCache['商品spu']){
    skuCache = row
  }
  let _sku = Object.assign(skuCache, row)
  resData.push(Object.assign(_sku, {
    'SKU': `${_sku['商品spu']}-${_sku['款式1']}-${_sku['款式2']}`
  }))
}

jsonToXlsx(resData, 'sheet1')