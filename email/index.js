/**
 * 修改密码，找回密码，发送验证码
 * 2020-05-11
 */
"use strict";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
//  const produceRandom = require('produce-random');
const config = {
  service: "QQ",
  auth: {
    user: "747624075@qq.com", //邮箱
    pass: "hsixcohnubszbaja", // 密码（该密码是获取的授权码，并非自己的邮箱密码，下面连接）
    //  [获取授权验证码](https://mail.qq.com/cgi-bin/frame_html?sid=Il3r6d10Ng62bCd5&r=e44820ec588276c81969dd73787eaf92)
  },
};

//创建
const transporter = nodemailer.createTransport(smtpTransport(config));

  //  let {
  //    recipient,
  //    type
  //  } = event

  // const recipient = "spurred.he@gmail.com";
  const recipient = "ljwbigtail@gmail.com"
  /**
   * recipient 收件人
   * subject 发送的主题
   * html 发送的html内容
   * from 发送人
   */
  //  let checkCode = produceRandom();
  //  let html = `<div>
  //      <h3>尊敬的xxx，您好！</h3>
  //      <p style="text-indent: 30px;">我们检测到，您正在执行${type==='modifi' ? '修改密码' : '找回密码'}操作，为进一步保护您的账户信息安全，请在操作页面输入以下验证码。</p>
  //      <p style="text-indent: 30px;font-weight: bold;">验证码：${checkCode}</p>
  //    </div>`
  //  let subject = type==='modifi' ? '修改密码' : '找回密码';
  //  let sendMailRes = await transporter.sendMail({
  //    from: config.auth.user,
  //    to: recipient,
  //    subject,
  //    html
  //  })

  let options = {
    from: config.auth.user, // 这里是你开启SMTP服务的QQ邮箱号
    to: recipient, // 这个是前端注册页面输入的邮箱号
    subject: "test",
    // html: `<div>
    //   <img src="//ups.aopcdn.com/s99/common/18960/1uc2e3182037c14e62b528605043dcf1e7.png?150" alt="" srcset="">
    //  </div>`,
     html: `<html xmlns="http://www.w3.org/1999/xhtml">

     <head>
       <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
       <title>1112332</title>
     </head>
     
     <body>
       <div>
         <table style="border-spacing:0;border-collapse:collapse;width:650px;background:#fff;margin:0;padding:0; min-width:650px;background-color:white;border-top: 5px solid #c6e7cd">
         <tr>
             <td style="text-align:center;padding-bottom:30px;padding-top:5px">
                 <a 
                     title="selaros" target="_blank" style="text-decoration:none;color:#525252 ;-webkit-transition:all .2s ease-out;-moz-transition:all .2s ease-out;-o-transition:all .2s ease-out;transition:all .2s ease-out">
                     <img width="221" height="57" style="width:160px;height: 57px;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic;max-width:100%;float:none;clear:both;display:block;margin:0 auto;border:0"
                         src="http://ups.aopcdn.com/s99/common/18960/1uc2e3182037c14e62b528605043dcf1e7.png"
                         class="center logo" border="0" align="none">
                 </a>
             </td>
         </tr>
     </table>  
       </div>
     </body>
     
     </html>`,
  };
  //  let sendMailRes = await transporter.sendMail({
  //    from: config.auth.user,
  //    to: recipient,
  //    subject: 'test',
  //    html
  //  })

  // console.log(sendMailRes);
  //  if(sendMailRes.response == '250 OK: queued as.'){
  //    return {
  //      status: 0,
  //      msg: "成功",
  //      checkCode
  //    }
  //  }
  //   return {
  //     status: -1,
  //     msg: "稍后重试"
  //   }

  transporter.sendMail(options, function (err, msg) {
    if (err) {
      console.log(err);
      // console.log(err)
    } else {
      console.log('邮箱发送成功!');
      // console.log('邮箱发送成功')
    }
  });
