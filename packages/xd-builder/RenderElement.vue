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
  position: absolute;
  img {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.gradient-border {
  --borderWidth: 2px;
  background: #1D1F20;
  position: relative;
  border-radius: var(--borderWidth);
  img {
    border-radius: var(--borderWidth);
  }
}

.gradient-border:after {
  content: '';
  position: absolute;
  top: calc(-1 * var(--borderWidth));
  left: calc(-1 * var(--borderWidth));
  height: calc(100% + var(--borderWidth) * 2);
  width: calc(100% + var(--borderWidth) * 2);
  background: linear-gradient(60deg, #533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
  border-radius: calc(2 * var(--borderWidth));
  z-index: 8;
  animation: animatedgradient 3s ease alternate infinite;
  background-size: 300% 300%;
}

@keyframes animatedgradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

</style>
