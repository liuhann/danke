<template>
<div class="paper-folder">
  <div v-for="i in splitArray[0]" :key="i">
   <!-- <img v-for="j in split[1]" :key="j" :src="element.url" :style="getRectStyle(i, j)"/>-->
    <div class="rect" v-for="j in splitArray[1]" :key="j" :style="getRectStyle(i, j)">
      <img class="full-img" :src="element.url" :style="getImageStyle(i, j)" />
    </div>
  </div>
</div>
</template>

<script>
import { addAnimationStyle, createSheet } from '../../frames/keyframe'
import { shortid } from '../../utils/string'

export default {
  name: 'PaperFolding.vue',
  props: {
    element: {
      type: Object
    },
    stage: {
      type: String,
      default: 'in'
    }
  },
  data () {
    return {
      // 图片拆分块数, [1, 3] 表示横向拆分一块（不拆分） ，纵向拆分3块 通过mounted从element中获取
      // (mounted之后可以获得容器长和宽)
      splitArray: [],
      containerWidth: 0,
      containerHeight: 0
    }
  },
  computed: {
    // 当前的动画
    'animation': function () {
      return this.element.animation[this.stage]
    },
    // 当前翻页配置
    'folding': function () {
      return this.element.folding
    }
  },
  created () {
    this.sheetId = shortid(10)
    this.sheet = createSheet(this.sheetId)
  },
  destroyed () {
    const sheet = document.getElementById(this.sheetId)
    sheet.parentElement.removeChild(sheet)
  },
  mounted () {
    this.splitArray = this.element.folding.split
    this.containerWidth = this.$el.clientWidth
    this.containerHeight = this.$el.clientHeight
    this.addCssStyle()
  },
  watch: {
    'element': {
      deep: true,
      handler () {
        this.addCssStyle()
      }
    }
  },
  methods: {
    // 增加样式（按stage）
    addCssStyle () {
      addAnimationStyle(this.sheet, this.element.animation[this.stage])
    },
    getImageStyle (i, j) {
      return {
        width: this.containerWidth + 'px',
        height: this.containerHeight + 'px',
        left: ((1 - i) / this.splitArray[0]) * this.containerWidth + 'px',
        top: ((1 - j) / this.splitArray[1]) * this.containerHeight + 'px'
      }
    },
    getRectStyle (i, j) {
      // const clipPath = `polygon(
      // ${(i - 1) / this.split[0] * 100 - 1}% ${(j - 1) / this.split[1] * 100}%,
      // ${i / this.split[0] * 100}% ${(j - 1) / this.split[1] * 100}%,
      // ${i / this.split[0] * 100}% ${j / this.split[1] * 100}%,
      // ${(i - 1) / this.split[0] * 100 - 1}% ${j / this.split[1] * 100}%)`
      const rectStyle = {
        left: ((i - 1) * 100 / this.splitArray[0]) + '%',
        top: ((j - 1) * 100 / this.splitArray[1]) + '%',
        width: (100 / this.splitArray[0] + 1) + '%',
        height: (100 / this.splitArray[0] + 1) + '%',
        animationName: this.animation.name,
        animationDuration: this.animation.duration + 'ms',
        animationTimingFunction: this.animation.timing,
        animationFillMode: 'backwards',
        animationDelay: this.getDistance([i, j], this.folding.from) * this.folding.inc + 'ms'
      }
      return rectStyle
    },
    /**
     * @param from
     * @param to
     */
    getDistance (from, to) {
      // 坐标原点为 -1 表示此列 或者此行所有元素动画间距都是0  即按整行或整列变化
      const xDistance = (from[0] === -1) ? 0 : Math.abs(from[0] - to[0])
      const yDistance = (from[1] === -1) ? 0 : Math.abs(from[1] - to[1])
      return xDistance + yDistance
    }
  }
}
</script>

<style lang="scss">
.paper-folder {
  width: 100%;
  height: 100%;
  position: relative;
  .rect {
    position: absolute;
    overflow: hidden;
    .full-img {
      max-width: initial;
      position: absolute;
      object-fit: cover;
    }
  }
}
</style>
