var db    = {};  
var mysql = require('mysql');  
var nodemailer = require('nodemailer');
var pool  = mysql.createPool({  
  connectionLimit : 10,  
  // host            : '10.22.46.215',  
  host            : '10.22.146.246',  
  user            : 'read_only_user',  
  password        : 'read_only_user',
  database        : 'guava-mall'  
});  
 
//执行sql语句并返回结果  
db.query = function(sql){  
 
  return new Promise(function(resolve, reject){
 
    if (!sql) {  
        reject('传参错误!');  
        return;  
    }  
 
    pool.query(sql, function(err, rows, fields) {  
      if (err) {  
        console.log(err);  
        reject(err) 
        return;  
      };  
 
      resolve(rows);
    });  
  })
  
};
 
//发送邮件,带附件
db.sendMail = function (xlsxname) {
 
  var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
      user: '747624075@qq.com',
      pass: ''   
    }
  });
 
  var mailOptions = {
    from: '747624075@qq.com', 
    to: ``, 
    subject: 'dpa!', 
    attachments:[{
    	filename : xlsxname,
    	path : `./${xlsxname}`
    }]
  };
  return new Promise(function(resolve, reject){
 
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      }else{
        resolve(info);
      }
    });
  })
}
 
//格式化当前时间
db.nowDate = function(){
	var date = new Date();
	var fmtTwo = function (number) {
    return (number < 10 ? '0' : '') + number;
  }
 	var yyyy = date.getFullYear();
  var MM = fmtTwo(date.getMonth() + 1);
  var dd = fmtTwo(date.getDate());
 
  var HH = fmtTwo(date.getHours());
  var mm = fmtTwo(date.getMinutes());
  var ss = fmtTwo(date.getSeconds());
 
  return '' + yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
 
}  
module.exports = db;