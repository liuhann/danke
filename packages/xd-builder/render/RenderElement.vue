<template>
<div :id="'element-' + element.id"
     @click="elementClicked"
     class="element" :class="elementClass" :style="elementStyle">
  <!--图片渲染-->
  <img v-if="element.url" :id="'img-' + (element.name || element.id)" :src="getImageUrl(element.url, viewPort.width * 2, viewPort.height * 2)" :style="element.style">
  <div v-else-if="element.content" class="svg-content" v-html="element.content" :style="element.style"/>
  <div v-else-if="element.elements" class="block-elements" :style="element.style">
    <render-element v-for="(el, i) in element.elements" :key="el.id" :view-box="viewBox" :view-port="viewPort" :element="el" :index="i" />
  </div>
  <svg v-else-if="element.path" :style="element.style" :viewBox="'0 0 ' + element.path.w + ' ' + element.path.h ">
    <path :d="generatePath" fill="var(--fill)" stroke-width="var(--stokeWidth)" stroke="var(--stroke)"/>
  </svg>
  <div v-else-if="!element.text" class="shape" :style="element.style">
  </div>
  <!--文本渲染情况下 文本内容-->
  <div v-for="(text, index) in elementTextLines" :style="textTransformStyle" class="text" :key="index">{{text}}</div>
  <textarea ref="textarea" v-if="element.text != null && element.editing" :style="textEditStyle" v-model="element.text" @change="updateTextArea"/>
</div>
</template>

<script>
import { getImageUrl } from '../mixins/imageUtils.js'
import { getRectPositionStyle } from '../mixins/rectUtils.js'
import { assignVariables } from '../mixins/renderUtils'
import TextList from '../left/TextList'
import textMesure from '../../utils/textMesure'
import { svg2url } from '../../utils/svg2url'

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
      default: 'enter'
    },
    // 缩放后的可用区域
    viewPort: {
      type: Object
    },
    // 实际原始坐标的区域
    viewBox: {
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
    if (this.element.url && this.element.url.endsWith('.svg')) {
      this.loadSvgContent()
    }
  },
  computed: {
    inlineStyle () {
      let stageVariables = this.element.variables.filter(variable => variable[this.stage] != null)
      if (stageVariables.length) {
        let percent0  = {}
        assignVariables(percent0, stageVariables, this.stage)
        let percent100  = {}
        assignVariables(percent100, stageVariables, 'value')
        return `<style>
          @keyframes ${this.element.id}-enter {
            0% ${JSON.stringify(percent0).replace(/"/g, '')}
            100% ${JSON.stringify(percent100).replace(/"/g, '')}
          }
        </style>`
      } else {
        return ''
      }
    },
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
      Object.assign(style, this.element.style)
      Object.assign(style, {
        textAlign: 'left'
      })
      style.height = this.element.height + 'px'
      return style
    },

    // 呈现时根据vp进行进一步缩放
    elementTextTransform () {
      if (this.viewPort && this.viewBox && this.element.text) {
        return {
          transform: `scale(${this.viewPort.width/this.viewBox.width})`
        }
      } else {
        return  {}
      }
    },

    elementStyle () {
      // 设置元素的长、宽到默认变量--width 、 --height
      const style = {
        '--width': this.element.width + 'px',
        '--height': this.element.height + 'px'
      }
      assignVariables(style, this.element.variables)
      Object.assign(style, getRectPositionStyle(this.element, this.viewBox, this.viewPort))
      Object.assign(style, this.elementAnimationStyle)
      if (this.element.text != null) {
        Object.assign(style, this.element.style)
      }

      if (this.element.maskImage) {
        style.maskImage = this.element.maskImage
      }
      // Object.assign(style, this.element.style)
      // this.appendTextTransform(style)
      // 对于正在编辑的元素不设置transform
      if (this.element.editing) {
        assignVariables(style, {
          transform: ''
        })
      }
      // 按大小指定视角
      style.perspective = this.element.width + 'px'
      return style
    },

    textTransformStyle () {
      const style = {}
      if (this.viewPort && this.viewBox) {
        style.transform = `scale(${this.viewPort.width/this.viewBox.width})`
        const avs = this.element.variables.filter(variable => variable.type === 'textAlign')
        if (avs.length) {
          const align = avs[0].value
          if (align === 'left') {
            style.transformOrigin = 'left top'
          }
          if (align === 'center') {
            style.transformOrigin = 'center top'
          }
          if (align === 'right') {
            style.transformOrigin = 'right top'
          }
        }
      }
      return style
    },

    elementInnerStyle() {

    },
    /**
     * 取 element.animations 计算元素的动画样式
     */

    elementAnimationStyle () {
      const element = this.element
      if (element.animation) {
        const animations = element.animation[this.stage]
        if (animations && animations.length) {
          // 单个动画
          if (animations.length === 1) {
            const animation = animations[0]
            return {
              animation: `${animation.name} ${animation.range[1]}s ${animation.timing} ${animation.range[0]}s ${animation.infinite? 'infinite': animation.iteration} both`
            }
          } else {
            const animationsOrdered = []
            // 多个动画次序或者重叠播放
            for (let i = 0; i < animations.length; i++) {
              const animation = animations[i]
              animationsOrdered.push(`${animation.name} ${animation.range[1]}s ${animation.timing} ${animation.range[0]}s ${animation.infinite? 'infinite': animation.iteration}`)
            }
            if (animationsOrdered.length) {
              return {
                animation: animationsOrdered.join(',')
              }
            }
          }
        }
      } else {
        return {}
      }
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
    },

    generatePath () {
      let d = ""
      this.element.path.points.forEach((p, i) => {
        if (i === 0) {
          // first point
          d += "M "
        } else if (p.q) {
          // quadratic
          d += `Q ${ p.q.x } ${ p.q.y } `
        } else if (p.c) {
          // cubic
          d += `C ${ p.c[0].x } ${ p.c[0].y } ${ p.c[1].x } ${ p.c[1].y } `
        } else if (p.a) {
          // arc
          d += `A ${ p.a.rx } ${ p.a.ry } ${ p.a.rot } ${ p.a.laf } ${ p.a.sf } `
        } else {
          d += "L "
        }

        d += `${ p.x } ${ p.y } `
      })
      if (this.closePath) d += "Z"
      return d
    },
  },
  data () {
    return {
    }
  },
  methods: {
    async loadSvgContent () {
      const result = await this.ctx.get(this.getImageUrl(this.element.url))
      this.$set(this.element, 'content', result.data)
    },
    getImageUrl,
    updateTextArea () {
      const measured = textMesure(this.elementTextContent, this.elementTextFontSize, this.elementTextWeight)
      if (measured.width > this.element.width) {
        this.element.width = measured.width
      }
      this.element.height = measured.height
    },

    // 处理viewport小的时候字体的变换，以便能在缩略情况下也看到缩小的文字
    appendTextTransform (style) {
      if (this.viewPort && this.viewBox && this.element.text) {
        if (style.transform) {
          style.transform = style.transform + ` scale(${this.viewPort.width/this.viewBox.width})`
        } else {
          style.transform = `scale(${this.viewPort.width/this.viewBox.width})`
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
  box-sizing: border-box;
  text-overflow: initial;
  white-space: nowrap;
  .block-elements {
    .element {
      position: absolute;
    }
  }
  img {
    mask-size: 100% 100%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
  .text {
    width: 100%;
    height: 100%;
  }
  textarea {
    text-align: left;
    resize: none;
    border: none;
    outline: none !important;
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
  .shape {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
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
