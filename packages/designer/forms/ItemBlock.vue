<template>
  <van-row class="config-block" type="flex" justify="space-around">
    <van-col span="6" class="tc label">
      <div @touchstart="touchStart" @touchmove="touchMove">{{title}}</div></van-col>
    <van-col span="18" class="full" v-if="!$slots.end">
      <slot></slot>
    </van-col>
    <van-col span="10" class="left" v-if="$slots.end">
      <slot></slot>
    </van-col>
    <van-col span="8" class="right" v-if="$slots.end">
      <slot name="end"></slot>
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
  },
  methods: {
    touchStart(e) {
      this.$emit('touch-start', e)
      console.log('ts')
    },

    touchMove (e) {
      this.$emit('touch-move', e)
      console.log('tm')
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
  .van-col {
    font-size: 14px;
  }
  .van-radio {
    margin-right: 14px;
  }
  .van-radio-group {
    display: flex;
  }
}
</style>
