<template>
  <van-row class="config-block" type="flex" justify="space-around">
    <van-col span="6" class="tc label">{{title}}</van-col>
    <van-col span="18">
      <slot></slot>
    </van-col>
  </van-row>
</template>

<script>
export default {
  name: 'ItemBlock',
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang="less">
.config-block {
  box-sizing: border-box;
  min-height: 44px;
  align-items: center;
  background-color: #fff;
}
</style>
