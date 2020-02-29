<template>
<div :id="'element-' + element.id"
     @click="elementClicked"
     class="element" :class="elementClass" :style="elementStyle">
  <!--图片渲染-->
  <img v-if="element.url" :id="'img-' + (element.name || element.id)" :src="getImageUrl(element.url, screen.width, screen.height)">
  <div v-if="element.svg" class="svg-content" v-html="elementSVGContent">
  </div>
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
    // 渲染的阶段
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
    elementClass () {
      let result = []
      if (this.element.hidden) {
        result.push(this.hidden)
      }
      for (let key in this.element.style) {
        if (this.element.style[key].name) {
          result.push(this.element.style[key].name)
        }
      }
      return result
    },
    borderClass () {
      if (this.element.style && this.element.style.border) {
        return this.element.style.border.name
      } else {
        return null
      }
    },
    elementStyle () {
      const style = {}
      Object.assign(style, getRectPositionStyle(this.element), this.elementAnimationStyle)
      // 根据border扩展设置， 展示扩展的属性
      if (this.element.style.border && this.element.style.border.variables) {
        for (let variable of this.element.style.border.variables) {
          if (variable.type === 'number') {
            Object.assign(style, {
              ['--' + variable.name]: variable.value + 'px'
            })
          } else {
            Object.assign(style, {
              ['--' + variable.name]: variable.value
            })
          }
        }
      }
      // 可配置颜色变量
      if (this.element.colors) {
        for (let variable of this.element.colors) {
          Object.assign(style, {
            ['--' + variable.name]: variable.value
          })
        }
      }
      style.perspective = (this.element.width + this.element.height) + 'px'
      return style
    },

    /**
     * 取 element.animations 计算元素的动画样式
     */
    elementAnimationStyle () {
      const element = this.element
      if (element.animations && element.animations.length) {
        // 单个动画
        if (element.animations.length === 1) {
          const animation = element.animations[0]
          return {
            animation: `${animation.name} ${animation.range[1]}ms ${animation.timing} ${animation.range[0]}ms both`
          }
        } else {
          const animationsOrdered = []
          // 多个动画次序或者重叠播放
          for (let i = 0; i < element.animations.length; i++) {
            const animation = element.animations[i]
            animationsOrdered.push(`${animation.name} ${animation.range[1]}ms ${animation.timing} ${animation.range[0]}ms ${i === element.animations.length - 1 ? '' : ''}`)
          }
          if (animationsOrdered.length) {
            return {
              animation: animationsOrdered.join(',')
            }
          }
        }
      }
      return {}
    },

    /**
     * 获取元素的SVG正文内容
     */
    elementSVGContent () {
      return this.ctx.styleRegistry.getVector(this.element.svg)
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getImageUrl,

    elementClicked () {
      console.log(this.element)
    },

    // 获取元素的动画特效
    getElementAnimationStyle (element) {

    },

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
  .svg-content {
    width: 100%;
    height: 100%;
    svg {
      width: 100%;
      height: 100%;
    }
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
