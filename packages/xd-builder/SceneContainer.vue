<template>
<div class="scene-wrapper">
  <div id="workspace" @mousedown="sceneMouseDown" ref="sceneContainer" :style="styleWorkSpace">
    <!-- 当前屏幕内容 -->
    <div class="screen" :style="styleScreen">
      <div class="screen-title">
      </div>
      <div class="scene" v-if="scene" :style="sceneStyle" :class="sceneClass">
         <render-element
            v-for="(element, index) of scene.elements"
            stage="enters"
            :element="element"
            :screen="screen"
            :view-port="screen"
            :key="index"
            :index="index"
            :ref="element.id"/>
      </div>
    </div>
    <!-- 元素被选中、移动、调整大小时的选中层 -->
    <div class="mask" :style="styleMask" @dragover="sceneDragOver" @drop="elementDropped" v-if="scene">
      <div
        v-for="selectee in scene.elements"
        :key="selectee.id"
        :id="'mask-' + selectee.id"
        class="node-mask"
        @dblclick="maskDblClick(selectee)"
        :class="getMaskClass(selectee)"
        :style="getMaskStyle(selectee)">
        <template v-if="selectee.props && selectee.props.resizable">
          <div class="lt"/><div class="rt"/><div class="t"/><div class="l"/><div class="lb"/><div class="rb"/><div class="r"/><div class="b"/>
        </template>
      </div>
    </div>
    <!-- 拖拽选择层 -->
    <div class="dragging-rect" :style="styleDragingRect"></div>

    <!--缩放、平移操作区-->
    <div class="screen-actions">
      <a class="action" @click="scaleDown">
        <i class="el-icon-minus"></i>
      </a>
      <span class="info">{{scaleDisplay}}</span>
      <a class="action" @click="scaleUp">
        <i class="el-icon-plus"></i>
      </a>
      <a class="action" @click="fitToCenter">
        <img :src="ICON_FIT">
      </a>
      <a class="action" @click="toggleActionMove" :class="actionMove? 'on': ''">
        <img :src="ICON_HAND">
      </a>
    </div>
  </div>
</div>
</template>

<script>
import { Button, ButtonGroup, Popover, Slider } from 'element-ui'
import interact from 'interactjs'
import RenderElement from './render/RenderElement.vue'
import { shortid } from '../utils/string'
import { getSVGViewBox } from '../vectors/utils'
import interactMixins from './mixins/interactMixins.js'
import { fitRectIntoBounds, getRectPositionStyle, isPointInRect, intersectRect } from './mixins/rectUtils.js'
import ICON_HAND from './res/hand.svg'
import ICON_FIT from './res/fit.svg'
const WORKSPACE_PADDING = 20
export default {
  name: 'SceneContainer',
  mixins: [ interactMixins ],
  components: {
    RenderElement,
    [Slider.name]: Slider,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [ButtonGroup.name]: ButtonGroup
  },
  props: {
    // 渲染当前的场景
    scene: {
      type: Object
    },
    // 渲染正在离开的场景
    existScene: {
      type: Object
    },
    screen: {
      type: Object
    },
    // 格式刷模式
    paste: {
      type: Object
    }
  },
  data: function () {
    return {
      // 屏幕区域缩放比例
      scale: 0.2,
      // 屏幕在工作区横向位置
      translateX: 0,
      // 屏幕区在工作区纵向位置
      translateY: 0,
      // 拖拽移动模式
      actionMove: false,
      // 工作区大小， 屏幕、拖拽及选择遮罩都在工作区内部
      workSpace: {
        width: 0,
        height: 0
      },
      // 屏幕区的位置
      screenRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      // 拖拽区域信息
      dragRect: {
        // 坐标 x, y
        left: 0,
        top: 0,
        // 宽度高度
        width: 0,
        height: 0,
        visible: false
      },
      // 正在编辑的选项
      currentAddon: null,
      // 当前正编辑的边框信息
      currentAddonObject: null,
      ICON_HAND,
      ICON_FIT
    }
  },

  watch: {
    // 场景更新操作，需要更新交互及其他页面元素
    scene () {
      for (let element of this.scene.elements) {
        this.destroyInteract(element)
      }
      this.$nextTick(() => {
        this.setElementsInteract()
      })
    },
    'screen': {
      deep: true,
      handler () {
        this.fitToCenter()
      }
    }
  },

  computed: {
    scaleDisplay () {
      return Math.floor(this.scale * 100) + '%'
    },
    styleWorkSpace () {
      const style = {
        width: this.workSpace.width + 'px',
        height: this.workSpace.height + 'px'
      }
      if (this.actionMove) {
        style.cursor = 'move'
      }
      return style
    },
    styleScreen () {
      const screenStyle = {
        transform: `translateX(${this.translateX}px) translateY(${this.translateY}px) scale(${this.scale})`,
        transformOrigin: 'top left',
        width: this.screen.width + 'px',
        height: this.screen.height + 'px',
        transition: 'transform .2s ease-out'
      }
      if (this.actionMove) {
        screenStyle.transition = ''
        screenStyle.cursor = 'move'
      }
      return screenStyle
    },
    styleMask () {
      const style = {}
      let isShow = true
      for (let element of this.scene.elements) {
        if (element.editing) {
          isShow = false
        }
      }
      if (!isShow) {
        style.display = 'none'
      }
      Object.assign(style, this.styleScreen)
      return style
    },
    // 拖拽中的矩形样式
    styleDragingRect () {
      return {
        display: this.dragRect.visible ? 'inherit' : 'none',
        left: this.dragRect.left + 'px',
        top: this.dragRect.top + 'px',
        width: this.dragRect.width + 'px',
        height: this.dragRect.height + 'px'
      }
    },
    sceneStyle () {
      const styles = {
        width: this.screenRect.width + 'px',
        height: this.screenRect.height + 'px'
      }
      delete this.scene.style.backgroundColor
      for (let key in this.scene.style) {
        const value = this.scene.style[key]
        if (typeof value === 'string') {
          Object.assign(styles, {
            [key]: value
          })
        }
      }
      return styles
    },
    /**
     * 获取场景class列表
     */
    sceneClass () {
      const classes = []
      for (let key in this.scene.style) {
        if (this.scene.style[key] && this.scene.style[key].name) {
          classes.push(this.scene.style[key].name)
        }
      }
      return classes
    },
    /**
     *
     **/
    selectedElements () {
      return this.scene.elements.filter(el => el.selected)
    }
  },

  mounted: function () {
    this.workSpace.width = this.$el.clientWidth
    this.workSpace.height = this.$el.clientHeight
    this.fitToCenter()
    this.initGlobalInteract()
    this.setElementsInteract()
  },

  methods: {
    /**
     * 将屏幕放置到设计区正中央，同时修改屏幕位置偏移量
     */
    fitToCenter () {
      // 上下左右边距30px  自适应到容器大小
      const fitSize = fitRectIntoBounds(this.screen, {
        width: this.workSpace.width - WORKSPACE_PADDING * 2,
        height: this.workSpace.height - WORKSPACE_PADDING * 2
      })
      // 自适应后，伸缩的比率
      this.scale = fitSize.width / this.screen.width
      if (fitSize.fitTo === 'width') {
        this.translateX = WORKSPACE_PADDING
        this.translateY = (this.workSpace.height - fitSize.height) / 2
      } else {
        this.translateX = (this.workSpace.width - fitSize.width) / 2
        this.translateY = WORKSPACE_PADDING
      }
      this.$emit('scale-fit', this.scale)
    },
    toggleActionMove () {
      this.actionMove = !this.actionMove
    },
    getRectPositionStyle,
    /**
     * 处理全局拖拽事件，全局拖拽主要负责元素拖拽多选选中处理
     */
    initGlobalInteract () {
      interact(this.$refs.sceneContainer).draggable({
        /**
         * 拖拽开始，如果只是点击不会触发拖拽事件。
         */
        onstart: event => {
          console.log('global on start', event)
          this.dragRect.left = event.x0 - event.rect.left
          this.dragRect.top = event.y0 - event.rect.top
          if (!this.actionMove) {
            this.dragRect.visible = true
          }
        },
        /**
         * 拖拽移动
         */
        onmove: event => {
          if (this.actionMove) {
            // 移动模式
            this.translateX += event.dx
            this.translateY += event.dy
          } else {
            // 计算正在拖拽的矩形区域
            this.dragRect.width = event.page.x - event.x0
            this.dragRect.height = event.page.y - event.y0
            // 拖拽多选模式
            // 向右拖拽： 重新计算left
            if (this.dragRect.width < 0) {
              this.dragRect.left = (event.x0 - event.rect.left) + this.dragRect.width
              this.dragRect.width = -this.dragRect.width
            }
            // 向上拖拽： 重新计算top
            if (this.dragRect.height < 0) {
              this.dragRect.top = (event.y0 - event.rect.top) + this.dragRect.height
              this.dragRect.height = -this.dragRect.height
            }

            // 判断矩形交叉的元素设置为选中
            this.dragRect.x = this.dragRect.left - this.screenRect.x - this.screenRect.width / 2 * (1 - this.scale)
            this.dragRect.y = this.dragRect.top - this.screenRect.y
            for (let element of this.scene.elements) {
              if (intersectRect({
                x: element.x * this.scale + this.translateX,
                y: element.y * this.scale + this.translateY,
                width: element.width * this.scale,
                height: element.height * this.scale
              }, this.dragRect)) {
                element.selected = true
              } else {
                element.selected = false
              }
            }
          }
        },
        /**
         * 拖拽结束
         */
        onend: event => {
          this.dragRect.visible = false
          // 取消mouseclick事件的触发
          this.dragRect.dragged = true
        }
      }).styleCursor(false)
    },

    /**
     * 进行鼠标点击位置检测，如果点击到元素则选中或保持多个的选择状态， 点到空白则取消所有元素选中
     */
    sceneMouseDown (ev) {
      // 鼠标得到所点的位置
      const rootRect = this.$refs.sceneContainer.getBoundingClientRect()
      const point = {
        x: ev.clientX - rootRect.x,
        y: ev.clientY - rootRect.y
      }
      // 获取选择的元素，重叠的获取z最高的
      let targetElement = null
      for (let element of this.scene.elements) {
        if (isPointInRect(point, {
          x: element.x * this.scale + this.translateX,
          y: element.y * this.scale + this.translateY,
          width: element.width * this.scale,
          height: element.height * this.scale
        }, 10)) {
          targetElement = element
        }
      }
      // 剪贴模式
      if (this.paste) {
        if (targetElement) {
          this.pasteStyleToTargetElement(targetElement)
        } else {
          this.$emit('clean-paste')
          this.setElementSelected(null)
        }
      } else {
        if (ev.ctrlKey) {
          this.appendElementSelected(targetElement)
        } else {
          if (this.selectedElements.length && this.selectedElements.indexOf(targetElement) > -1) {
            return
          }
          this.setElementSelected(targetElement)
        }
      }
    },

    // Drag over and set as allow drop
    sceneDragOver (ev) {
      ev.preventDefault()
    },

    /**
     * 放置元素到页面
     */
    elementDropped (ev) {
      ev.preventDefault()
      const data = ev.dataTransfer.getData('Text')
      const element = JSON.parse(data)
      const node = this.createElement()
      let width = 100
      let height = 100
      node.name = element.name || ('节点' + this.scene.elements.length + 1)
      if (element.width && element.height) {
        // 获取元素自适应到整个画面的高度和宽度
        const fit = fitRectIntoBounds(element, this.screen)
        width = fit.width
        height = fit.height
      }
      if (element.variables) {
        node.variables = element.variables
      }
      // svg 图片处理 content -> svg
      if (element.content) {
        const vb = getSVGViewBox(element.content)
        if (vb) {
          width = vb.width
          height = vb.height
          node.isRatioFixed = true
        }
        node.svg = element._id
      }
      // 文本增加
      if (element.text) {
        node.text = element.text
      }
      // 放置的图片
      if (element.url) {
        node.url = element.url
        node.style.clipPath = ''
      }
      Object.assign(node.style, element.style)
      node.x = ev.offsetX - width / 2
      node.y = ev.offsetY - height / 2
      node.width = width
      node.height = height
      // 自动适应到屏幕内部 避免溢出
      node.x = (node.x < 0) ? 0 : node.x
      node.y = (node.y < 0) ? 0 : node.y
      this.scene.elements.push(node)
      this.setElementSelected(node)
      this.$nextTick(() => {
        this.initElementDragResize(node)
      })
    },

    /**
     * 增加一个节点
     */
    createElement () {
      const id = shortid()
      // 此处设置节点的基本属性
      const node = {
        id,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        props: {
          resizable: true,
          movable: true
        },
        style: {},
        animation: {},
        selected: false
      }
      return node
    },

    /**
     * 初始化所有元素的interaction
     */
    setElementsInteract () {
      for (let element of this.scene.elements) {
        this.initElementDragResize(element)
      }
    },

    /**
     * 设置单个元素为选中状态, 取消其他元素选中
     */
    setElementSelected (element) {
      for (let e of this.scene.elements) {
        e.selected = false
        if (element == null && e.editing) {
          e.editing = false
        }
      }
      if (element) {
        element.selected = true
      }
    },

    /**
     * append element selecting
     **/
    appendElementSelected (element) {
      for (let e of this.scene.elements) {
        if (e.editing) {
          e.editing = false
        }
      }
      if (element) {
        element.selected = true
      }
    },

    /**
     * 获取遮罩的样式，对于未选中的设置为display: none
     */
    getMaskStyle (element) {
      const displayStyle = {}
      // if (!element.selected) {
      //   displayStyle.opacity = 0
      // } else {
      //   if (element.editing) {
      //     displayStyle.opacity = 0
      //   }
      // }
      return Object.assign(displayStyle, getRectPositionStyle(element))
    },

    getMaskClass (element) {
      if (!element.selected) {
        return 'not-selected'
      } else {
        if (element.editing) {
          return 'not-selected'
        }
      }
      return 'selected'
    },

    maskDblClick (element) {
      if (element.text) {
        this.$set(element, 'editing', true)
      }
    },

    scaleDown () {
      this.scale -= 0.05
    },
    scaleUp () {
      this.scale += 0.05
    },

    /**
     * do actural paste work
     * @param element
     */
    pasteStyleToTargetElement (element) {
      if (this.paste) {
        element.width = this.paste.width
        element.height = this.paste.height

        element.animation = JSON.parse(JSON.stringify(element.animation))
        for (let key in this.paste.style) {
          if (element.style[key] != null) {
            if (typeof element.style[key] === 'object') {
              this.copyVariableValue(this.paste.style[key].variables, element.style[key].variables)
            } else {
              element.style[key] = this.paste.style[key]
            }
          }
        }
      }
    },
    copyVariableValue (source, target) {
      if (source.length === target.length) {
        for (let i = 0; i < source.length; i++) {
          if ((target[i].name === source[i].name) && (target[i].type === source[i].type)) {
            target[i].value = source[i].value
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.scene-wrapper {
  flex: 1;
  overflow: hidden;
  width: 100%;

  .screen-actions {
    z-index: 1001;
    position: absolute;
    right: 20px;
    bottom: 20px;
    background: rgba(255,255,255, .6);
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 10px;
    font-size: 16px;

    .action {
      line-height: 36px;
      cursor: pointer;
      margin: 0 5px;
      color: #0e1318;
      font-weight: 400;
      padding: 0 8px;
      display: inline-block;
      &:hover, &.on {
        background-color: #f1f3f4;
      }
      i {
        vertical-align: text-bottom;
        font-weight: bold;
      }
      img {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: text-bottom;
      }
    }
  }
}
#workspace {
  position: relative;
  .screen {
    position: absolute;
    background-color: #fff;
    box-shadow: 0 0 6px #ddd;
    overflow: hidden;
  }
  .mask {
    position: absolute;
    z-index: 100;
    box-shadow: 0 0 0 1px #fff;
  }
  .dragging-rect {
    z-index: 901;
    position: absolute;
    border: 1px solid #42A5F5;
    background: #3366665e;
  }
  .node-mask {
    position: relative;
    &.not-selected {
      border: 1px solid transparent;
      >div {
        opacity: 0;
      }
    }
    &.selected {
      border: 1px dashed #00bf72;
      >div {
        opacity: 1;
      }
    }
    >div {
      border: 1px solid #42A5F5;
      width: 8px;
      height: 8px;
      background-color: #fff;
      position: absolute;
    }
    .drag-handle {
      left: -30px;
      top: 5px;
    }
    .l {
      left: -5px;
      top: calc(50% - 4px);
    }
    .lt {
      left: -4px;
      top: -4px;
    }
    .lb {
      left: -4px;
      bottom: -4px;
    }
    .rt {
      top: -4px;
      right: -4px;
    }
    .rb {
      right: -4px;
      bottom: -4px;
    }
    .r {
      right: -4px;
      top: calc(50% - 4px);
    }
    .b {
      bottom: -4px;
      left: calc(50% - 4px);
    }
    .t {
      top: -4px;
      left: calc(50% - 4px);
    }

  }
}

</style>
