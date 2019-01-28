<template>
<div class="edit-animation">
  <van-cell class="group-title" :title="title" icon="expand-o" />
  <item-block title="效果">
    <animation-selector v-model="value.animation" :type="type"></animation-selector>
  </item-block>
  <item-block title="时长">
    <van-stepper v-model="value.duration" integer disable-input :step="50"/>
  </item-block>
  <item-block title="延迟">
    <van-stepper v-model="value.delay" disable-input :step="20"/>
  </item-block>
  <item-block title="速度曲线">
    <select v-model="value.timing">
      <option v-for="(value, key) in cubicBesizers" :key="key" :value="key">{{key}}</option>
    </select>
  </item-block>
  <item-block title="重复" v-if="value.infinite">
    <van-stepper v-model="value.iteration" integer disable-input/>
    <van-switch v-model="value.infinite" size="24px"/> 循环
  </item-block>
</div>
</template>

<script>
import AnimationSelector from './AnimationSelector'
import cubicBesizers from '../../utils/cubic-beziers'
import ItemBlock from './ItemBlock'
export default {
  name: 'EditAnimation',
  props: {
    value: {
      type: Object
    },
    type: {
      type: Array
    },
    title: {
      type: String
    }
  },
  components: {
    ItemBlock,
    AnimationSelector
  },
  computed: {
    cubicBesizers () {
      return cubicBesizers
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

<style lang="less">

.edit-animation {
  .van-stepper {

  }
}

</style>
