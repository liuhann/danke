<template>
<div class="scene-edit-wrapper">
  <van-row type="flex" justify="space-around">
    <van-col span="4">自动播放</van-col>
    <van-col span="16"><van-switch v-model="value.auto" /></van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4">时间</van-col>
    <van-col span="16"><van-stepper v-model="value.hideDelay" integer disable-input :step="50"/></van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4">背景</van-col>
    <van-col span="16"></van-col>
  </van-row>
</div>
</template>

<script>
export default {
  name: 'SceneEdit',
  components: {
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {

    }
  },
  watch: {
    value () {
      this.setDataFromValue()
    }
  },

  created () {
    this.setDataFromValue()
  },

  methods: {
    setDataFromValue () {
    }
  }
}
</script>

<style lang="less">
.scene-edit-wrapper {

}
</style>
