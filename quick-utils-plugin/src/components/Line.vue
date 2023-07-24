<template>
  <span :class="['line', 'line-' + type]"></span>
</template>

<script lang="ts" setup>
defineProps({
  type: {
    type: String,
    default: "horizontal", // horizontal | vertical
  },
});
</script>

<style scoped lang="less">
.line {
  display: block;
  width: 100%;
  &.line-horizontal {
    margin: var(--leoui-space-1) 0;
    border-top: var(--leoui-border);
  }
  &.line-vertical {
    margin: 0 var(--leoui-space-1);
    height: 1em;
    border-right: var(--leoui-border);
  }
}
</style>
