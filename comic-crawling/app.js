const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const pdfkit = require("pdfkit");
const sharp = require('sharp');

const iPhone = puppeteer.devices['iPhone 12 Pro'];

// 参数配置
const config = {
  base: "http://m.qiman57.com/", // 爬取的网页
  id: 16080, // 漫画id
  bookName: "after_the_one", // 漫画名称
  dir: "",
  waitDay: 7, // 每7天更新一次列表
  // userPassword: 'test', // 打开密码
};
config.dir = "end/" + config.bookName; // 保存的文件夹名称

const global = {
  taskNum: 0,
  log: (val) => {
    console.log(`${++global.taskNum}. ${val}`);
  }
}

// 文件夹不存在就创建
async function exitsDir(reaPath) {
  const absPath = path.resolve(__dirname, reaPath);
  try {
    await fs.readdirSync(absPath);
  } catch (e) {
    await fs.mkdirSync(absPath, { recursive: true });
  }
}

// 手动延时
async function delay(time){
  return new Promise(res => {
    setTimeout(()=>{
      res()
    }, time)
  })
}

/**
 * 使用文件进行数据缓存
 */
class FileCache {
  constructor(filename) {
    this.filename = filename;
    this.cache = undefined;
  }
  async clear() {
    await fs.writeFileSync("");
  }
  async get() {
    if (this.cache) return this.cache;
    const cahceFileString = await this.exitsFile(this.filename);
    try {
      this.cache = JSON.parse(cahceFileString);
    } catch (err) {
      this.cache = {};
    }
    return this.cache;
  }
  async set() {
    this.cache = this.cache ?? (await this.get());
    if (arguments.length == 1) {
      if (typeof arguments[0] == "object") {
        this.cache = Object.assign({}, this.cache, arguments[0]);
      } else {
        console.error("arguments[0] type err");
      }
    } else if (arguments.length == 2) {
      const [key, value] = arguments;
      this.cache[key] = value;
    } else {
      console.error("arguments err");
    }
    const absPath = path.resolve(__dirname, this.filename);
    await fs.writeFileSync(absPath, JSON.stringify(this.cache, null, '\n'));
    return this.cache;
  }
  async exitsFile(reaPath) {
    const absPath = path.resolve(__dirname, reaPath);
    try {
      await fs.statSync(absPath);
    } catch (e) {
      await fs.writeFileSync(absPath, "", { recursive: true });
    }
    return await fs.readFileSync(absPath);
  }
}

// 获取章节列表
const getListJSON = async (browser) => {
  // 获取DOM
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto(`${config.base}${config.id}/`);
  await page.click(".show-more");
  await page.waitForResponse((res) => {
    return res.request().url().includes("bookchapter");
  });
  const bodyInnerHTML = await page.$eval("body", (dom) => dom.innerHTML);
  // DOM => array
  const getList = (data) => {
    const $ = cheerio.load(data);
    const _data = $(".catalog-box .catalog-list ul li")
      .map((e, el) => {
        const a = $(el).find("a");
        return {
          href: a.attr("href"),
          name: a.text(),
        };
      })
      .toArray();
    return _data;
  };
  const data = getList(bodyInnerHTML);
  // 关闭页面
  await page.close();
  return data;
};

// 批量存储图片
function saveImgs(imgs) {
  imgs.map((img) => {
    (img.src.includes("https:") ? https : http).get(img.src, (res) => {
      let imgData = "";
      res.setEncoding("binary");
      res.on("data", (chunk) => {
        imgData += chunk;
      });
      res.on("end", async () => {
        await fs.writeFileSync(`./${config.dir}/${img.file}`, imgData, "binary");
      });
    });
  });
}

// 图片倒出道pdf
const imgToPDF = async function (imgs, outFilename) {
  // pdf
  const pdfName = `./${config.dir}/pdf/${outFilename}`
  let doc = null
  try{
    doc = new pdfkit({
      autoFirstPage: false, // 不要第一页
      Title: config.bookName,
      // userPassword: config.userPassword,
    });
    doc.pipe(fs.createWriteStream(pdfName));
    // A4 (595.28 x 841.89)
    // 图片尺寸 (800 * 1270)
    imgs.map((img) => {
      const _imgSrc = reSetExt(`./${config.dir}/${img.file}`, 'jpg')
      doc
        .addPage({
          margin: 0,
        })
        .image(_imgSrc, 0, 0, {
          fit: [580, 800],
          align: "center",
          valign: "center",
        });
    });
    doc.end();
  }catch(err){
    console.error('PDF 存储异常：', outFilename);
    console.log(err);
    await fs.rmSync(pdfName)
    console.error('异常PDF删除：', pdfName);
  }
};

// webp => jpg
async function imgFormat(imgs){
  if(!imgs)return
  for (let index = 0; index < imgs.length; index++) {
    const imgSrc = `./${config.dir}/${imgs[index].file}`
    const _imgSrc = reSetExt(imgSrc, 'jpg')
    if(getExt(imgSrc) != 'jpg'){
      try{
        await fs.readFileSync(_imgSrc)
      }catch(e){
        await sharp(imgSrc).toFile(_imgSrc)
      }
    }
  }
}

const reverseIndex = function(sub, index){
  return (sub - index).toString().padStart(4, '0')
}

const getExt = function(name){
  let ext = name.substring(name.lastIndexOf(".")+1)
  return ['jpg', 'webp'].includes(ext) ? ext : 'jpg'
}

const reSetExt = function(name, ext){
  const _ext = getExt(name)
  const reg = new RegExp(_ext)
  return name.replace(reg, ext)
}

// 根据任务列表递归查询图片地址列表 并 保存图片
const task = async (browser, list, index, cb) => {
  let cache = await fileCache.get();
  if (list.length - cache.endSection + 1 == index) {
    // 任务结束关闭浏览器
    global.log("图片缓存完毕");
    fileCache.set("done", 1); // 缓存完
    await browser.close();
    cb && cb();
    return;
  }
  // 有缓存时 跳过并执行下一个任务
  let imgs = list[index].imgs;
  if (!imgs) {
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto(`${config.base}${list[index].href}`);
    const newImgs = await page.evaluate(() => window.newImgs);
    imgs = newImgs.map((e, i) => {
      let ext = getExt(e)
      return {
        src: e,
        file: `img/${reverseIndex(list.length, index)}_${i + 1}_${list[index].name}.${ext}`,
      };
    });
    list[index].imgs = imgs;
    // 保存文件
    await saveImgs(imgs);
    // 成功后 添加缓存
    cache = await fileCache.set("list", list);
    page && await page.close();
  }
  // await delay(300)
  // 递归 查询下一个任务
  await task(browser, list, ++index, cb);
};

// 创建缓存文件
const fileCache = new FileCache(`./${config.dir}/cache.json`);
let browser = null;

// 任务
const run_img = async (browser, cache) => {  
  await task(browser, cache.list, 0, function () {
    global.log("任务结束");
  });
};

async function run_pdf(list){
  // 多图转pdf
  let cache = await fileCache.get();
  for (let index = 0; index < (list.length - cache.endSection); index++) {
    const pdfName = `${reverseIndex(list.length, index)}_${list[index].name}.pdf`;
    let needsPDF = false;
    try {
      await fs.statSync(`./${config.dir}/pdf/${pdfName}`);
    } catch (e) {
      needsPDF = true;
    }
    if (needsPDF) {
      await imgFormat(list[index].imgs)
      await imgToPDF(list[index].imgs, pdfName);
    }
  }
  fileCache.set("endSection", list.length); // 缓存章节数
}

process.on("uncaughtException", async function (err) {
  await fileCache.set("done", 0); // 任务缓存未完
  console.error("缓存异常：", err);
  browser && (await browser.close());
  process.exit(0);
});

(async function(){
  await exitsDir(`./${config.dir}/img`);
  await exitsDir(`./${config.dir}/pdf`);

  let cache = await fileCache.get();
  // 时间小于 X 天就不执行
  let stopInfo = "";
  if (cache.list && cache.updateTime) {
    if (+new Date() - cache.updateTime < 1000 * 60 * 60 * 24 * config.waitDay) {
      stopInfo = "还没到设定的更新时间。";
    }
  }
  if (cache.done == 0) {
    // 未完成 继续处理
    stopInfo = "";
  }
  if (stopInfo !== "") {
    global.log("任务暂停：" + stopInfo);
    return;
  }
  global.log("任务开始");
  browser = await puppeteer.launch({ 
    headless: true, // 无头模式 [false 启动界面]
    // slowMo: 10, //有时候因为网络原因或者其他页面渲染的原因，默认模式下 puppeteer 操作过快，会出现找不到页面元素等各种意想不到的异常，这时候我们可以设置 slowMo: number 来让 puppeteer 的每一步操作都间隔一定时间
    args: [ //启动 Chrome 的参数
      '--window-size=390,844'
    ],
    defaultViewport: {
      isMobile: true,
      width: 390, height: 844, //页面大小
    },
   });
  // 获取并保存列表缓存
  let list = await getListJSON(browser);
  if (!cache.list || list.length != cache.endSection) {
    cache = await fileCache.set({
      list,
      updateTime: +new Date(),
    });
    global.log(`增量更新至${list[0].name}章;共${cache.list.length - cache.endSection}章`);
  }
  global.log(`列表获取完毕`);

  await run_img(browser, cache)
  global.log(`图片获取完毕`);

  await run_pdf(cache.list)
  global.log(`PDF生成完毕`);

})()
