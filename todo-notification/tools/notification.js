const path = require('path')
const notifier = require("node-notifier");

const icon = path.join(__dirname, "../src/logo.png")
const actionLabel = '确认'
const closeLabel = '否认'

// 提醒
module.exports = {
  run: function (option) {
    const { title, message, ok, cancel } = option
    notifier.notify(
      {
        title,
        message,
        icon, // mac 不起作用
        contentImage: icon,
        sound: true, // Only Notification Center or Windows Toasters
        
        // 回复选项
        // reply: true,

        // 选择回复选项
        closeLabel,
        actions: actionLabel
        
      },
      function (err, response, metadata) {
        if(err){
          new Error(err)
          return
        }
        // Response is response from notification
        // Metadata contains activationType, activationAt, deliveredAt
        const { activationValue, activationType } = metadata
        switch(activationType){
          case 'contentsClicked': 
            ok && ok();
            break;
          case 'actionClicked': 
            if(activationValue == actionLabel){
              ok && ok()
            }else{
              console.log('Error: res value can not parse');
            }
            break;
          case 'closed':
            cancel && cancel()
            break;
        }
      }
    );
  
    // notifier.on("click", function (notifierObject, options, event) {
    //   // Triggers if `wait: true` and user clicks notification
    //   ok && ok()
    // });
  }
};
