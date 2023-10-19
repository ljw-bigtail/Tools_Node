<template>
  <div class="app-action">
    <dt>
      <dd>
        <h1>运营工具箱</h1>
      </dd>
    </dt>
    <dl>
      <dd class="row">
        <div class="col form-label flexbox">
          <img :src="topSvg" alt="" srcset="" />
          置顶链接模式：
        </div>
        <div class="col form-item">
          <Switch v-model="setting.topLinkMode" color="green" @change="handleChange"></Switch>
        </div>
      </dd>
    </dl>
    <Line />
    <div class="flexbox">
      <img :src="homeSvg" alt="" srcset="" />
      <a href="https://ljw-bigtail.github.io/" target="_blank">鹿酒的院子 Go!</a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, Ref } from "vue";
import { Switch, Line } from "@/components/index";
import { AppConfig } from "@/utils/types";
import homeSvg from "@/assets/home.svg";
import topSvg from "@/assets/top.svg";

const setting: Ref<AppConfig> = ref({
  topLinkMode: false,
});

const sendToContent = (data: any, callback?: Function) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs: any) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      data,
    }, (res: any) => {
      callback && callback(res);
    });
  });
};

const handleChange = () => {
  sendToContent({
    actions: "set",
    data: setting.value
  }, function (res: any) {
    console.log("get content res:" + res);
  });
};

sendToContent({
  actions: 'get'
}, (data: AppConfig) => {
  console.log(data)
  if(data){
    setting.value = data
  }
})

// chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
//   if(req.data == 1){
//     setting.value.topLinkMode = false
//     handleChange()
//     sendResponse('cache fresh')
//   }
// })

</script>
<style lang="less" scope>
.row {
  display: flex;
  align-items: center;
}
.app-action {
  width: 200px;
  padding: var(--leoui-space-1);
  // margin: var(--leoui-space-1);
  text-align: left;
  // box-shadow: var(--leoui-shadow);
  border-radius: var(--leoui-radius);
  font-size: 14px;
  img {
    width: 18px;
    margin-right: 0.5em;
  }
  .form-item {
    flex: 1;
    text-align: right;
  }
  .flexbox {
    display: flex;
    align-items: center;
    &.flexend{
      justify-content: flex-end;
    }
  }
  a {
    text-decoration: underline;
  }
  h1{
    font-size: 18px;
    padding-bottom: var(--leoui-space-1);
    display: none;
  }
}
</style>
