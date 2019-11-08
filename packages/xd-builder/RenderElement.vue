<template>
<div :id="'element-' + element.id"
     @click="$emit('click')"
     class="element" :class="[element.visible?'':'hidden', 'type' + element.type]" :style="element.style + ';' + 'z-index:' + index + ';'">
  <!--图片渲染-->
  <img v-if="element.type === TypeEnum.IMAGE" :src="element.url" :style="element.innerStyle || ''">
  <paper-folding v-if="element.type === TypeEnum.PAPERFOLD" :url="element.url" direction="v" :split="5"/>
  <!--文本渲染情况下 文本内容-->
  <span v-if="element.type === TypeEnum.TEXT" v-html="element.text"></span>
  <!--文件被选中的遮罩-->
  <div class="mask" v-if="selected">
    <!--右下角corner-->
    <div class="corner-rb"></div>
  </div>
</div>
</template>

<script>
import { TypeEnum } from '../danke-core/elements/index'
import PaperFolding from './plugin/PaperFolding.vue'
export default {
  name: 'RenderElement.vue',
  components: {
    PaperFolding
  },
  props: {
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
  data () {
    return {
      TypeEnum
    }
  }
}
</script>

<style scoped>

</style>
