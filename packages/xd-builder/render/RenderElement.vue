<template>
<div :id="'element-' + element.id"
     @click="elementClicked"
     class="element" :class="elementClass" :style="elementStyle">
  <!--图片渲染-->
  <img v-if="element.url" :id="'img-' + (element.name || element.id)" :src="getImageUrl(element.url, viewPort.width, viewPort.height)">
  <div v-if="element.svg" class="svg-content" v-html="elementSVGContent" />
  <!--文本渲染情况下 文本内容-->
  <template :style="elementTextTransform" v-if="element.text != null && !element.editing">{{element.text}}</template>
  <textarea v-if="element.text != null && element.editing" :style="textEditStyle" v-model="element.text"/>
  <div v-if="element.elements" class="block">
    <render-element v-for="(el, i) in element.elements" :key="el.id" :screen="viewPort" :element="el" :index="i" />
  </div>
</div>
</template>

<script>
import { getImageUrl } from '../mixins/imageUtils.js'
import { getRectPositionStyle } from '../mixins/rectUtils.js'
import TextList from '../left/TextList'
export default {
  name: 'RenderElement',
  components: {
    TextList,
    RenderElement: () => import('./RenderElement.vue')
  },
  props: {
    // 渲染的阶段
    stage: {
      type: String,
      default: 'enters'
    },
    viewPort: {
      type: Object
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
        result.push('hidden')
      }
      for (let key in this.element.style) {
        if (this.element.style[key].name) {
          result.push(this.element.style[key].name)
        }
      }
      return result
    },

    textEditStyle () {
      const style = {
        fontFamily: `'Karla',Microsoft YaHei,tahoma,arial,Hiragino Sans GB,sans-serif;`
      }
      for (let key in this.element.style) {
        const styled = this.element.style[key]
        if (typeof styled === 'string') {
          Object.assign(style, {
            [key]: styled
          })
        }
        if (typeof styled === 'number') {
          Object.assign(style, {
            [key]: styled + 'px'
          })
        }
      }
      return style
    },

    // 呈现时根据vp进行进一步缩放
    elementTextTransform () {
      if (this.viewPort && this.screen && this.element.text) {
        return {
          transform: `scale(${this.viewPort.width/this.screen.width})`
        }
      } else {
        return  {}
      }
    },

    elementStyle () {
      const style = {}
      Object.assign(style, getRectPositionStyle(this.element, this.screen, this.viewPort), this.elementAnimationStyle, this.elementTextTransform)
      for (let key in this.element.style) {
        const styled = this.element.style[key]
        if (typeof styled === 'string' || typeof styled === 'number') {
          Object.assign(style, {
            [key]: styled
          })
        }
        if (styled.variables) {
          for (let variable of styled.variables) {
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
      }
      style.perspective = (this.element.width + this.element.height) + 'px'
      return style
    },
    /**
     * 取 element.animations 计算元素的动画样式
     */

    elementAnimationStyle (                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ) {
      const element = this.element
      const animations = element.animation[this.stage]
      if (animations && animations.length) {
        // 单个动画
        if (animations.length === 1) {
          const animation = animations[0]
          return {
            animation: `${animation.name} ${animation.range[1]}ms ${animation.timing} ${animation.range[0]}ms both`
          }
        } else {
          const animationsOrdered = []
          // 多个动画次序或者重叠播放
          for (let i = 0; i < animations.length; i++) {
            const animation = animations[i]
            animationsOrdered.push(`${animation.name} ${animation.range[1]}ms ${animation.timing} ${animation.range[0]}ms ${i === animations.length - 1 ? '' : ''}`)
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
  box-sizing: border-box;
  text-overflow: initial;
  white-space:nowrap;
  textarea {
    resize: none;
    border: none;
    background: transparent;
    width: 100%;
    overflow: hidden;
  }
  /*color: transparent;*/
  /*-webkit-background-clip: text;*/
  /*-webkit-text-fill-color: transparent;*/
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
