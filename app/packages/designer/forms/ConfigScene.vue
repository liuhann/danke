<template>
<div class="scene-edit-wrapper">
  <van-row type="flex" justify="space-around">
    <van-col span="4">坐标系</van-col>
    <van-col span="20">
      <van-radio-group v-model="config.coordinate">
        <van-radio name="tl">左上角</van-radio>
        <van-radio name="center">正中</van-radio>
      </van-radio-group>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4">播放</van-col>
    <van-col span="20">
      <van-radio-group v-model="config.play">
        <van-radio name="auto">自动</van-radio>
        <van-radio name="trigger">手动</van-radio>
      </van-radio-group>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around" v-if="config.play==='auto'">
    <van-col span="4">时间</van-col>
    <van-col span="20">
      <van-stepper v-model="config.triggerClose" integer disable-input :step="50"/>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4">背景</van-col>
    <van-col span="20"></van-col>
  </van-row>
</div>
</template>

<script>
export default {
  name: 'SceneEdit',
  components: {
  },
  props: {
    sceneConfig: {
      type: Object
    }
  },
  data () {
    return {
      config: this.sceneConfig
    }
  },
  watch: {
    sceneConfig (val) {
      this.config = val
    }
  },

  created () {
  },

  methods: {

  }
}
</script>

<style lang="less">
.scene-edit-wrapper {

}
</style>
