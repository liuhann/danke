<template>
<div class="config-work">
  <van-nav-bar title="作品配置" @click-right="close" @click-left="addEmptyScene">
    <van-icon name="cross" slot="right" />
  </van-nav-bar>

  <edit-background v-model="work.background"></edit-background>

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
import ItemBlock from './ItemBlock'
import EditBackground from './EditBackground'
export default {
  name: 'SceneEdit',
  components: {
    EditBackground,
    ItemBlock
  },
  props: {
    work: {
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
