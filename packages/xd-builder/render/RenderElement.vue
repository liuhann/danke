<template>
  <div :id="'element-' + element.id"
       class="element"
       :class="elementClass" :style="elementWrapperStyle" @click="elementClicked"
  >
    <!--图片渲染-->
    <div v-if="element.html" class="html" :style="elementStyle" v-html="templateStr(element.html, element)" />
    <img v-else-if="elementUrl && !element.fill" :id="'img-' + (element.name || element.id)" :src="elementUrl" :style="elementStyle">
    <div v-else-if="element.content" class="svg-content" :style="elementStyle" v-html="element.content" />
    <div v-else-if="element.elements" class="block-elements" :style="elementStyle">
      <render-element v-for="(el, i) in element.elements" :key="el.id" :view-box="viewBox" :view-port="viewPort" :element="el" :index="i" />
    </div>
    <div v-else-if="!element.text" class="shape" :style="elementStyle">
    </div>
    <div v-if="filterSVG" style="display:none;">
      <svg v-html="filterSVG" />
    </div>
  </div>
</template>

<script>
import { getImageUrl } from '../../utils/getImageUrl.js'
import { getRectPositionStyle } from '../mixins/rectUtils.js'
import { getColorVariables } from '../../utils/svg'
import { templateStr } from '../../utils/string.js'
import { assignVariables } from '../mixins/renderUtils'
import textMesure from '../../utils/textMesure'
import cubicBerziers from '../../frames/model/cubic-beziers.js'
import { ensureFont } from '../../utils/fontfaces'
import debug from 'debug'
import anime from 'animejs/lib/anime.js'

const trace = debug('danke:rener-element')

/**
 * 元素特性组合有以下几种情况
 * 1、mono vector： fill color 、
 *  实现： backgroundColor + mask
 * 2、image or background vector: mask with mono vector
 */
export default {
  name: 'RenderElement',
  components: {
    RenderElement: () => import('./RenderElement.vue')
  },
  props: {
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
    variables: {
      type: Array,
      default: function () {
        return []
      }
    },
    play: {
      type: Boolean,
      default: false
    },
    seek: {
      type: Number
    }
  },
  data () {
    return {
    }
  },
  computed: {
    elementUrl () {
      const filterSet = (this.variables || []).filter(variable => variable.type === 'image')
      if (filterSet.length === 1) {
        return filterSet[0].value
      } else if (this.element.url) {
        return this.getImageUrl(this.element.url, this.viewPort.width, this.viewPort.height)
      } else {
        return null
      }
    },

    elementText () {
      const filterSet = (this.variables || []).filter(variable => variable.type === 'text')
      if (filterSet.length === 1) {
        return filterSet[0].value
      } else if (this.element.text && !this.element.editing) {
        return this.element.text
      } else {
        return null
      }
    },

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
      if (this.element.hasOwnProperty('text')) {
        result.push('text')
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
        backgroundColor: this.element.fill,
        ...this.element.style, 
      }

      let scale = 1
      if (this.viewBox && this.viewPort) {
        scale = this.viewPort.width / this.viewBox.width
      }

      // 填充色情况下，图片显示为遮罩
      if (this.element.fill && this.element.url) {
        style.maskImage = `url(${this.getImageUrl(this.element.url, this.viewPort.width * 2, this.viewPort.height * 2)})`
        style.maskSize = this.element.fit || 'cover'
        style.maskPosition = 'center center'
      }
      // 变量配置信息
      assignVariables(style, this.element.variables, 'value', scale)

      // 合并外围配置变量信息
      if (this.variables) {
        assignVariables(style, this.variables.filter(variable => variable.variable), 'value', scale)
      }

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
        if (this.element.rotate) {
          const transforms = []
          transforms.push(`rotate(${this.element.rotate}deg)`)
          if (transforms.length) {
            Object.assign(style, {
              transform: transforms.join(' ')
            })
          }
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
        style.maskImage = `url("${this.getImageUrl(this.element.maskImage)}")`
      }
      if (this.element.mask && this.element.mask.uid) {
        style.clipPath = `url("#${this.element.mask.uid}")`
      }
      const result = Object.assign({}, style)
      return result
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
          // style.lineHeight = (zoomedSize * 1.2) + 'px'
        }
      }
      // Object.assign(style, this.elementAnimationStyle)
      return style
    },

    /**
     * 取 element.animations 计算元素的动画样式
     * @deprecated
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

  watch: {
    play () {
      if (this.play === true) {
        this.initAnime()
      } else {
        if(this.animation) {
          this.animation = null
        }
      }
      if (this.animation && this.play === true) {
        this.animation.play()
      }
    },
    seek () {
      if (this.seek >= 0) {
        this.animation.seek(this.seek)
      }
    }
  },
  mounted () {
    this.onMounted()
  },
  methods: {
    templateStr,
    async onMounted () {
      await this.initElementResource()
    },

    initAnime () {
      this.animeTargets = this.element.animation.targets ? this.$el.querySelector(this.element.animation.targets): this.$el
      this.animation = anime(Object.assign({
        loop: false
      },  this.element.animation, {
        targets: this.animeTargets,
        autoplay: this.play
      }))
      if (this.seek >= 0) {
        this.animation.seek(this.seek)
      }
    },

    async initElementResource () {
      // 加载必要的字体
      if (this.element.variables && this.element.variables.filter(variable=> variable.type === 'font-familly').length) {
        await ensureFont(this.ctx, this.element.variables.filter(variable=> variable.type === 'font-familly')[0].value)
      }
      // 对于svg图片的处理，
      if (this.element.url && this.element.url.endsWith('.svg') && this.element.tags && this.element.tags.indexOf('colorable') > -1) {
        const fetching = await fetch(getImageUrl(this.element.url))
        const svgContent = await fetching.text()
        let { svg, variables} = getColorVariables(svgContent)
        if (!this.element.variables || this.element.variables.length === 0) {
          this.element.variables = variables
        }
        this.element.html = svg
      }
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
  &.text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .block-elements {
    .element {
      position: absolute;
    }
  }
  img {
    mask-size: 100% 100%;
  }
  .html {
    width: 100%;
    height: 100%;
  }

  svg {
    width: 100%;
    height: 100%;
  }
  .text {
    width: 100%;
    text-align: center;
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
