"use strict";

module.exports = {
  baidu: {
    // TODO 2022.08.24 百度目前限制 5W字符/月 超过不收费，报54004
    api: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
    appid: "20220530001233746",
    key: "btjTvCeuWBzTO2dnlaTg",
    waitTime: 1000
  },
  tencent: {
    // TODO 2022.08.24 腾讯目前限制 500W字符字符/月 超出后 58元/每百万字符
    ProjectId: 1252043281,
    secretId: 'AKIDkQvHVWfhbQGAtPsGVYS7eLDJG2lOzgGh',
    secretKey: 'UwGQSNAA0nQxNl5Pcilmk5KTQJKMWht0',
    waitTime: 200
  },
  googlefree: {
    waitTime: 200
  }
};