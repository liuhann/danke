<template>
<div class="edit-animation">
  <van-row type="flex" justify="space-around">
    <van-col span="6">效果</van-col>
    <van-col span="18">
      <animation-selector v-model="value.animation"></animation-selector>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="6">时长</van-col>
    <van-col span="18"><van-stepper v-model="value.duration" integer disable-input :step="50"/>ms</van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="6">延迟</van-col>
    <van-col span="18"><van-stepper v-model="value.delay" disable-input :step="20"/></van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="6">Timing</van-col>
    <van-col span="18">
      <select v-model="value.timing">
        <option v-for="value in cubicBesizers" :key="value" :value="value">{{value}}</option>
      </select>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around" v-if="value.infinite">
    <van-col span="6">次数</van-col>
    <van-col span="18">
      <van-stepper v-model="value.iteration" integer disable-input/>
      <van-switch v-model="value.infinite" size="24px"/> 循环
    </van-col>
  </van-row>
</div>
</template>

<script>
import AnimationSelector from './AnimationSelector'
import utils from '../../utils/util'
export default {
  name: 'EditAnimation',
  props: {
    value: {
      type: Object
    },
    type: {
      type: String
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
