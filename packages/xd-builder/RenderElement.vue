<template>
<div :id="'element-' + element.id"
     @click="$emit('click')"
     class="element" :class="[element.visible?'':'hidden', element.className, 'type' + element.type]" :style="element.style">
  <!--图片渲染-->
  <img v-if="element.type === TypeEnum.IMAGE" :id="'img-' + (element.name || element.id)" :src="element.url" :style="element.innerStyle || ''">
  <!--文本渲染情况下 文本内容-->
  <span v-if="element.type === TypeEnum.TEXT" v-html="element.text" :class="element.className" :data-content="element.text"></span>
</div>
</template>

<script>
import { TypeEnum } from '../danke-core/elements/index'
import PaperFolding from '../danke-plugins/paperfold/PaperFolding.vue'
export default {
  name: 'RenderElement',
  components: {
    PaperFolding
  },
  props: {
    // 渲染的阶段，可以为 in/dura/out
    stage: {
      type: String,
      default: 'in'
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
      TypeEnum
    }
  },
  methods: {
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
}
</style>
