<template>
<div :id="'element-' + element.id"
     @click="$emit('click')"
     class="element" :class="[element.visible?'':'hidden', element.className, 'type' + element.type]" :style="element.style + ';' + 'z-index:' + index + ';'">
  <!--图片渲染-->
  <img v-if="element.type === TypeEnum.IMAGE" :src="element.url" :style="element.innerStyle || ''">
  <!--图片折纸效果-->
  <paper-folding v-if="element.type === 11" :stage="stage" :element="element" />
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
  data () {
    return {
      TypeEnum
    }
  }
}
</script>

<style lang="scss">
.element {
  overflow: hidden;
}
</style>
