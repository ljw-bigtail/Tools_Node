# 说明

## FB-DPA

功能：为facebook自动广告提供数据，定期发送邮件

Tips：由于业务原因，本来FB支持定时任务爬取数据（导表），最终只能发表给业务人员。另，FB支持pixel自动添加商品数据（缺点，下架/商品更新不及时）

运行方式： 在promise中修改数据库信息、右键信息后，在 cmd 中 node ./auto.js

## Font-Min（字珠）

功能：把用到的字从完整的字体文件中get到，生成小文件

运行方式：在auto中修改字体原文件和需要设置的文字内容，在 cmd 中 node ./run.js

## Properties-to-Json

功能 提取java项目中的 `.properties` 数据，生成json

运行方式：粘贴文件至 Properties-to-Json/properties 在 cmd 中 node ./app.js，Properties-to-Json/json是结果， Properties-to-Json/err是未兼容数据

## translate-tool

功能：srt文件 使用 百度翻译 从英文到中文 支持断点续传（当百度翻译api返回异常时）（超时情况暂未处理）

文件放到：/Tools-by-node/translate-tool/file 翻译好的 在 ./end 里，文件同名
