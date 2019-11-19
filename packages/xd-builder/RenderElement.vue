<template>
<div :id="'element-' + element.id"
     @click="$emit('click')"
     class="element" :class="[element.visible?'':'hidden', element.className, 'type' + element.type]" :style="element.style + ';' + 'z-index:' + index + ';'">
  <!--图片渲染-->
  <img v-if="element.type === TypeEnum.IMAGE" :src="element.url" :style="element.innerStyle || ''">
  <paper-folding v-if="element.type === 11" :url="element.url" :split="element.split"/>
  <!--文本渲染情况下 文本内容-->
  <span v-if="element.type === TypeEnum.TEXT" v-html="element.text" :class="element.className" :data-content="element.text"></span>
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

<style lang="scss">
.mask {
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: 2px dashed #87b1f1;
  box-sizing: border-box;
  .corner-rb {
    display: none;
    background-color: #87b1f1;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
  }
}
</style>
