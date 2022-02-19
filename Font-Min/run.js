var Fontmin = require('fontmin');

var fontmin = new Fontmin()
    .src('./方正正大黑繁体.TTF') // 设置服务端源字体文件
    .dest('./end/') // 设置生成字体的目录
    .use(Fontmin.glyph({ 
        text: '以互联网为基础的跨境电商公司 以互聯網為基礎的跨境電商公司', // 设置需要的自己
    }));

fontmin.run(function (err, files) { // 生成字体
    if (err) {
        throw err;
    }
    console.log(files[0]); // 返回生成字体结果的Buffer文件 	
});