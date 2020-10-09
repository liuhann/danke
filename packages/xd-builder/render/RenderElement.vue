<template>
  <div :id="'element-' + element.id"
       class="element"
       :class="elementClass" :style="elementWrapperStyle" @click="elementClicked"
  >
    <!--图片渲染-->
    <img v-if="element.url && (!element.fill)" :id="'img-' + (element.name || element.id)" :src="getImageUrl(element.url, viewPort.width * 2, viewPort.height * 2)" :style="elementStyle">
    <div v-else-if="element.content" class="svg-content" :style="elementStyle" v-html="element.content" />
    <div v-else-if="element.elements" class="block-elements" :style="elementStyle">
      <render-element v-for="(el, i) in element.elements" :key="el.id" :view-box="viewBox" :view-port="viewPort" :element="el" :index="i" />
    </div>
    <svg v-else-if="element.path" :style="elementStyle" :viewBox="'0 0 ' + element.path.w + ' ' + element.path.h ">
      <path :d="generatePath" fill="var(--fill)" stroke-width="var(--stokeWidth)" stroke="var(--stroke)" />
    </svg>
    <svg v-else-if="element.svg" :viewBox="'0 0 ' + element.svg.vp[2] + ' ' + element.svg.vp[3]" :style="elementStyle">
      <path v-for="(path, index) in element.svg.ps" :key="index" :d="path.p" :fill="path.f || '#76D9FC'" />
    </svg>
    <div v-else-if="element.html" :style="elementStyle" v-html="element.html" />
    <div v-else-if="!element.text" class="shape" :style="elementStyle">
    </div>
    <!--文本渲染情况下 文本内容-->
    <div v-for="(text, index) in elementTextLines" :key="index" :style="textTransformStyle" class="text">{{ text }}</div>
    <textarea v-if="element.text != null && element.editing" ref="textarea" v-model="element.text" :style="textEditStyle" @change="updateTextArea" />

    <svg v-if="element.mask && element.mask.svg" :viewBox="'0 0 ' + element.mask.svg.vp[2] + ' ' + element.mask.svg.vp[3]">
      <defs>
        <clipPath :id="element.mask.uid" :style="{
          transform: `scaleX(${element.width/element.mask.svg.vp[2]}) scaleY(${element.height/element.mask.svg.vp[3]})`
        }"
        >
          <path v-for="(path, index) in element.mask.svg.ps.filter(p => !p.f)" :key="index" :d="path.p" />
        </clipPath>
      </defs>
      <path v-for="(path, index) in element.mask.svg.ps.filter(p => p.f)" :key="index" :d="path.p" :fill="path.f" />
    </svg>
    <div v-if="filterSVG" style="display:none;">
      <svg v-html="filterSVG">
      </svg>
    </div>
  </div>
</template>

<script>
import { getImageUrl } from '../mixins/imageUtils.js'
import { getRectPositionStyle } from '../mixins/rectUtils.js'
import { assignVariables } from '../mixins/renderUtils'
import textMesure from '../../utils/textMesure'
import { svg2url } from '../../utils/svg2url'
import cubicBerziers from '../../frames/model/cubic-beziers.js'

export default {
  name: 'RenderElement',
  components: {
    RenderElement: () => import('./RenderElement.vue')
  },
  props: {
    // 渲染的阶段
    stage: {
      type: String,
      default: ''
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
  data () {
    return {
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
      if (this.element.filter) {
        result.push(this.element.filter.name)
      }
      return result
    },

    filterSVG () {
      if (this.element.filter && this.element.filter.svgContent) {
        return this.element.filter.svgContent
      } else {
        return null
      }
    },

    textEditStyle () {
      const style = {}
      Object.assign(style, this.element.style)

      if (this.viewPort && this.viewBox) {
        if (this.element.variables.filter(variable => variable.name === 'fontSize').length) {
          const fontSize = this.element.variables.filter(variable => variable.name === 'fontSize')[0].value
          const zoomedSize = fontSize * this.viewPort.width/this.viewBox.width
          if (zoomedSize < 8) {
            style.display = 'none'
          } else {
            style.fontSize = zoomedSize + 'px'
          }
        }
      }

      style.height = this.element.height + 'px'
      return style
    },

    elementWrapperStyle () {
      // 设置元素的长、宽到默认变量--width 、 --height
      const style = {
        '--width': this.element.width + 'px',
        '--height': this.element.height + 'px',
        backgroundColor: this.element.fill
      }

      if (this.element.type === 'vct' && this.element.fill) {
        style.maskImage = `url(${this.getImageUrl(this.element.url, this.viewPort.width * 2, this.viewPort.height * 2)})`
        style.maskSize = this.element.fit
      }
      // 变量配置信息
      assignVariables(style, this.element.variables)
      // 位置信息
      Object.assign(style, getRectPositionStyle(this.element, this.viewBox, this.viewPort))
      // Object.assign(style, this.elementAnimationStyle)
      if (this.element.text != null) {
        Object.assign(style, this.element.style)
      }

      // this.appendTextTransform(style)
      // 对于正在编辑的元素不设置transform
      if (this.element.editing) {
        Object.assign(style, {
          transform: ''
        })
      } else {
        const transforms = []
        if (this.element.rotate) {
          transforms.push(`rotate(${this.element.rotate}deg)`)
        }
        if (this.element.rotateX) {
          transforms.push(`rotateX(180deg)`)
        }
        if (this.element.rotateY) {
          transforms.push(`rotateY(180deg)`)
        }
        if (transforms.length) {
          Object.assign(style, {
            transform: transforms.join(' ')
          })
        }
      }
      // 按大小指定视角
      style.perspective = (this.element.style.perspective || this.element.width) + 'px'
      return style
    },

    elementStyle () {
      const style = {}
      if (this.element.fit) {
        style.objectFit = this.element.fit
      }
      if (this.element.maskImage) {
        style.maskImage = this.element.maskImage
      }
      if (this.element.mask && this.element.mask.uid) {
        style.clipPath = `url("#${this.element.mask.uid}")`;
      }
      return Object.assign({}, this.element.style, style, this.elementAnimationStyle)
    },

    textTransformStyle () {
      const style = {}
      if (this.viewPort && this.viewBox) {
        if (this.element.variables.filter(variable => variable.name === 'fontSize').length) {
          const fontSize = this.element.variables.filter(variable => variable.name === 'fontSize')[0].value
          const zoomedSize = fontSize * this.viewPort.width/this.viewBox.width
          if (zoomedSize < 8) {
            style.display = 'none'
          } else {
            style.fontSize = zoomedSize + 'px'
          }
          style.lineHeight = (zoomedSize * 1.2) + 'px'
        }
      }
      Object.assign(style, this.elementAnimationStyle)
      return style
    },

    /**
     * 取 element.animations 计算元素的动画样式
     */
    elementAnimationStyle () {
      const element = this.element
      const style = {}
      let animations = [];

      if (element.animation.preview && element.animation.preview.length) {
        animations = element.animation.preview
      } else if (element.animation) {
        animations = element.animation[this.stage]
      }
      if (animations) {
        if (animations.length) {
          // 单个动画
          if (animations.length === 1) {
            const animation = animations[0]
            // 非内部动画
            assignVariables(style, animation.variables)
            style.animation = `${animation.name} ${animation.duration}s ${cubicBerziers[animation.easing]} ${animation.delay}s ${animation.iterationCount} ${animation.direction} ${animation.fillMode}`
          } else {
            const animationsOrdered = []
            // 多个动画次序或者重叠播放
            for (let i = 0; i < animations.length; i++) {
              const animation = animations[i]
              // // 非内部动画
              if (!animation.inner) {
                assignVariables(style, animation.variables)
                animationsOrdered.push(`${animation.name} ${animation.duration}s ${cubicBerziers[animation.easing]} ${animation.delay}s ${animation.iterationCount} ${animation.direction} ${i===0? 'backwards': ''}`)
              }
            }
            if (animationsOrdered.length) {
              style.animation = animationsOrdered.join(',')
            }
          }
        }
      }
      return style
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
  mounted () {
    if (this.element.url && this.element.url.endsWith('.svg')) {
    }
  },
  methods: {
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
  position: absolute;
  mask-repeat: no-repeat;
  &::before {
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 11;
  }
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
  }
  textarea {
    text-align: left;
    resize: none;
    border: none;
    outline: none !important;
    background: transparent;
    overflow: hidden;
    width: 100%;
  }
  /*color: transparent;*/
  /*-webkit-background-clip: text;*/
  /*-webkit-text-fill-color: transparent;*/
  img {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
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
