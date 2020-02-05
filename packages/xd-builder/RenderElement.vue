<template>
<div :id="'element-' + element.id"
     @click="$emit('click')"
     class="element" :class="[element.hidden? 'hidden' : '', element.className]" :style="getRectPositionStyle(element)">
  <!--图片渲染-->
  <img v-if="element.url" :id="'img-' + (element.name || element.id)" :src="getImageUrl(element.url, screen.width, screen.height)" :style="element.innerStyle || ''">
  <!--文本渲染情况下 文本内容-->
  <span v-if="element.text" v-html="element.text" :class="element.className" :data-content="element.text"></span>
</div>
</template>

<script>
import { getImageUrl } from './mixins/imageUtils.js'
import { getRectPositionStyle } from './mixins/rectUtils.js'
export default {
  name: 'RenderElement',
  components: {
  },
  props: {
    // 渲染的阶段，可以为 in/dura/out
    stage: {
      type: String,
      default: 'in'
    },
    screen: {
      type: Object
    },
    element: { // 元素定义
      type: Object
    },
    index: { // 索引，多个元素时决定显示次序
      type: Number
    },
    selected: { // 是否选中
      type: Boolean
    }
  },
  mounted () {

  },
  computed: {
  },
  data () {
    return {
    }
  },
  methods: {
    getImageUrl,
    getRectPositionStyle,
    getElementPositionStyle (element) {
      return {
        left: element.x + 'px',
        top: element.y + 'px',
        width: element.width + 'px',
        height: element.height + 'px'
      }
    },
    render (stage) {

    },
    getImageDiv () {
      return this.$refs.img
    }
  }
}
</script>

<style lang="scss">
.element {
  overflow: hidden;
  position: absolute;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
