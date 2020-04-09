<template>
<div :id="'element-' + element.id"
     @click="elementClicked"
     class="element" :class="elementClass" :style="elementStyle">
  <!--图片渲染-->
  <img v-if="element.url" :id="'img-' + (element.name || element.id)" :src="getImageUrl(element.url, viewPort.width, viewPort.height)">
  <div v-if="element.svg" class="svg-content" v-html="elementSVGContent" />
  <!--文本渲染情况下 文本内容-->
  <template v-for="(text, index) in elementTextLines">{{text}}<br></template>
  <textarea ref="textarea" v-if="element.text != null && element.editing" :style="textEditStyle" v-model="element.text" @change="updateTextArea"/>
  <div v-if="element.elements" class="block">
    <render-element v-for="(el, i) in element.elements" :key="el.id" :screen="viewPort" :element="el" :index="i" />
  </div>
</div>
</template>

<script>
import { getImageUrl } from '../mixins/imageUtils.js'
import { getRectPositionStyle } from '../mixins/rectUtils.js'
import TextList from '../left/TextList'
import textMesure from '../../utils/textMesure'

const CSSPX = ['fontSize', 'letterSpacing']

export default {
  name: 'ment',
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
      const style = {}
      for (let key in this.element.style) {
        const styled = this.element.style[key]
        if (CSSPX.indexOf(key) > -1) {
          Object.assign(style, {
            [key]: this.element.style[key] + 'px'
          })
        } else {
          Object.assign(style, {
            [key]: this.element.style[key]
          })
        }
      }
      style.height = this.element.height + 'px'
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

    // 位置及大小的样式
    elementRectPositionStyle () {
      return getRectPositionStyle(this.element, this.screen, this.viewPort)
    },

    elementStyle () {
      const style = {
        ['--width']: this.element.width + 'px',
        ['--height']: this.element.height + 'px'
      }
      Object.assign(style, this.elementRectPositionStyle)
      Object.assign(style, this.elementAnimationStyle)
      this.assignVariables(style, this.element.variables)
      for (let key in this.element.style) {
        const styled = this.element.style[key]
        Object.assign(style, {
          [key]: this.element.style[key]
        })
      this.assignVariables(style, styled.variables)
      }
      this.appendTextTransform(style)
      style.perspective = (this.element.width + this.element.height) + 'px'
      return style
    },
    /**
     * 取 element.animations 计算元素的动画样式
     */

    elementAnimationStyle (                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ) {
      const element = this.element
      if (element.animation) {
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
      }
      return {}
    },

    elementTextLines () {
      if (this.element.text != null && !this.element.editing) {
        return this.element.text.split('\n')
      } else {
        return []
      }
    },

    elementTextFontSize () {
      let fonts = this.element.variables.filter(variable => variable.type === 'fontSize')
      if (fonts.length) {
        return fonts[0].value
      } else {
        return 1
      }
    },

    elementTextWeight () {
      let fonts = this.element.variables.filter(variable => variable.type === 'fontWeight')
      if (fonts.length) {
        return fonts[0].value
      } else {
        return 1
      }
    },

    elementTextContent () {
      return this.element.text.replace(/\n/g, '<br>')
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
      textAreaHeight: this.element.height
    }
  },
  methods: {
    getImageUrl,
    updateTextArea () {
      const measured = textMesure(this.elementTextContent, this.elementTextFontSize, this.elementTextWeight)
      console.log(measured)
      if (measured.width > this.element.width) {
        this.element.width = measured.width
      }
      this.textAreaHeight = this.$refs.textarea.scrollHeight
      this.element.height = this.$refs.textarea.scrollHeight
    },
    assignVariables (style, variables) {
      if (variables && variables.length) {
        for (let variable of variables) {
          if (variable.type === 'number' || variable.type === 'fontSize') {
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
    },

    appendTextTransform (style) {
      if (this.viewPort && this.screen && this.element.text) {
        if (style.transform) {
          style.transform = style.transform + ` scale(${this.viewPort.width/this.screen.width})`
        } else {
          style.transform = `scale(${this.viewPort.width/this.screen.width})`
        }
        if (this.element.style.textAlign === 'left') {
          style.transformOrigin = 'left top'
        }
        if (this.element.style.textAlign === 'center') {
          style.transformOrigin = 'center top'
        }
        if (this.element.style.textAlign === 'right') {
          style.transformOrigin = 'right top'
        }
      }
    },

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
    text-align: left;
    resize: none;
    border: none;
    background: transparent;
    overflow: hidden;
    width: 10000px;
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
