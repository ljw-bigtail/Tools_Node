<script setup lang="ts">
import { computed } from "vue";

interface switchOpt {
  modelValue: boolean;
  disabled?: boolean;
  bold?: boolean;
  color?: "default" | "green" | "blue" | "red" | "orange" | "yellow";
  name?: [string, string];
  size?: "mini";
}

const props = withDefaults(defineProps<switchOpt>(), {
  modelValue: false,
  disabled: false,
  bold: true,
  color: "blue",
  name: undefined,
  size: undefined,
});
const emits = defineEmits(["update:modelValue"]);

const trigger = (e: Event) => {
  emits("update:modelValue", (e.target as HTMLInputElement).checked);
};

const classObj = computed(() => {
  return {
    "leoui-switcher": true,
    ["leoui-switcher--unchecked"]: !props.modelValue,
    ["leoui-switcher--disabled"]: props.disabled,
    ["leoui-switcher--bold"]: props.bold,
    ["leoui-switcher--bold--unchecked"]: props.bold && !props.modelValue,
    [`leoui-switcher--color--${props.color}`]: props.color,
    size: props.size,
  };
});
</script>

<template>
  <div class="leoui-switcher-box">
    {{ name && name[0] }}
    <div :class="classObj">
      <input type="checkbox" @change="trigger" :checked="modelValue" />
      <div></div>
    </div>
    {{ name && name[1] }}
  </div>
</template>

<style lang="less">
@color-default: #aaa;
@color-green: #53b96e;
@color-blue: #539bb9;
@color-red: #b95353;
@color-orange: #b97953;
@color-yellow: #bab353;

@colors: @color-default, @color-green, @color-blue, @color-red, @color-orange, @color-yellow;
@names: default green blue red orange yellow;

.loop(@i: 1) when(@i <= length(@colors)) {
  @color: extract(@colors, @i);
  @name: extract(@names, @i);
  &.leoui-switcher--color--@{name} {
    div {
      background-color: lighten(@color, 5%);
      &:after {
        background-color: darken(@color, 10%);
      }
    }
    &.leoui-switcher--unchecked {
      div {
        background-color: @color;
        &:after {
          background-color: lighten(@color, 20%);
        }
      }
    }
  }
  .loop(@i + 1);
}

.leoui-switcher-box {
  display: inline-flex;
  align-items: center;
  .leoui-switcher {
    position: relative;
    --leoui-switcher-size: 14px;
    --leoui-switcher-size2: calc(2 * var(--leoui-switcher-size));
    --leoui-switcher-size-bold: calc(1.5 * var(--leoui-switcher-size));
    --leoui-switcher-size2-bold: calc(3 * var(--leoui-switcher-size));
    input {
      opacity: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      z-index: 1;
      cursor: pointer;
      margin: 0;
      padding: 0;
    }
    div {
      --leoui-switcher-drift: calc(1.2 * var(--leoui-switcher-size));
      height: var(--leoui-switcher-size);
      width: var(--leoui-switcher-size2);
      border-radius: var(--leoui-switcher-size2);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      transition: linear 0.2s, background-color linear 0.2s;
      &:after {
        content: "";
        height: var(--leoui-switcher-drift);
        width: var(--leoui-switcher-drift);
        border-radius: 50%;
        display: block;
        transition: linear 0.15s, background-color linear 0.15s;
        position: absolute;
        left: calc(100% - var(--leoui-switcher-size) / 2);
        transform: translate(-50%, -50%);
        cursor: pointer;
        top: 50%;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
      }
    }
    &--unchecked {
      div {
        justify-content: flex-end;
        &:after {
          left: calc(var(--leoui-switcher-size) / 2);
        }
      }
    }
    &--disabled {
      div {
        opacity: 0.3;
      }
      input {
        cursor: not-allowed;
      }
    }
    &--bold {
      div {
        // height: 26px;
        // width: 52px;
        height: var(--leoui-switcher-size-bold);
        width: var(--leoui-switcher-size2-bold);
        &:after {
          left: calc(100% - var(--leoui-switcher-size-bold) / 2);
        }
      }
      &--unchecked {
        div {
          &:after {
            left: calc(var(--leoui-switcher-size-bold) / 2);
          }
        }
      }
    }
    .loop();
  }
}
</style>
