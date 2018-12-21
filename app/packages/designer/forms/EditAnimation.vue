<template>
<div class="edit-animation">
  <van-row type="flex" justify="space-around">
    <van-col span="4">效果</van-col>
    <van-col span="16">
      <van-tag v-if="value.animation" plain>{{value.animation}}</van-tag>
      <van-button size="small" plain type="primary" @click="showChooseAnimation('entrance')">选择</van-button>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4">时长</van-col>
    <van-col span="20"><van-stepper v-model="value.duration" integer disable-input :step="50"/>ms</van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4">延迟</van-col>
    <van-col span="20"><van-stepper v-model="value.delay" disable-input :step="20"/></van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4">Timing</van-col>
    <van-col span="20">
      <select v-model="value.timing">
        <option v-for="value in cubicBesizers" :key="value" :value="value">{{value}}</option>
      </select>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around" v-if="value.infinite">
    <van-col span="4">次数</van-col>
    <van-col span="20">
      <van-stepper v-model="value.iteration" integer disable-input/>
      <van-switch v-model="value.infinite" size="24px"/> 循环
    </van-col>
  </van-row>
  <animation-selector ref="animationSelector"></animation-selector>
</div>
</template>

<script>
import AnimationSelector from './AnimationSelector'
import utils from '../../utils/util'
export default {
  name: 'EditAnimation',
  props: {
    element: {
      type: Object
    },
    value: {
      type: Object
    }
  },
  components: {
    AnimationSelector
  },
  computed: {
    cubicBesizers () {
      return utils.cubicBesizers
    }
  },
  methods: {
    showChooseAnimation (type) {
      this.$refs.animationSelector.open(type, cssName => {
        this.element.animationPreview = {
          animation: cssName,
          duration: 1000,
          timing: 'easeOutQuad',
          delay: 0
        }
      }, cssName => {
        this.value.animation = cssName
      })
    }
  }
}
</script>

<style scoped>

</style>
