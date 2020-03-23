<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  width="240"
  title="透明度"
  @show="showPop"
  trigger="click">
  <a class="action" slot="reference">
    <img :src="SVG">
  </a>
  <div class="item">
    <el-slider v-model="slideVal" :min="0" :max="1" @change="slideChange" :step=".01"></el-slider>
  </div>
</el-popover>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import SVG from './res/transparent.svg'
export default {
  name: 'PopTransparent',
  mixins: [toolbarPopMixin],
  data() {
    return {
      slideVal: 0,
      SVG
    }
  },
  methods: {
    slideChange (val) {
      this.$set(this.element.style, 'opacity', val)
    },
    showPop () {
      this.slideVal = this.element.style.opacity || 1
    }
  }
}
</script>

<style scoped>
.item {
  padding: 0 20px;
}
</style>
