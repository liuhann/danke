<template>
  <div id="scene-container">
    <div id="workspace" ref="sceneContainer" :style="styleWorkSpace" @mousedown="sceneMouseDown" @wheel.prevent="sceneMouseWheel">
      <!-- 当前屏幕内容 -->
      <div class="screen" :style="styleScreen">
        <div class="screen-title" />
        <div v-if="scene" class="scene" :style="sceneStyle">
          <render-element
            v-for="(element, index) of scene.elements"
            :key="element.id"
            :ref="element.id"
            :stage="element.stage"
            :element="element"
            :view-box="viewBox"
            :view-port="viewPort"
            :index="index"
          />
        </div>
      </div>
      <!-- 元素被选中、移动、调整大小时的选中层 -->
      <div v-if="scene" class="mask" :style="styleMask" @drop="elementDropped" @dragover="sceneDragOver">
        <div
          v-for="selectee in scene.elements"
          :id="'mask-' + selectee.id"
          :key="selectee.id"
          class="node-mask"
          :class="getMaskClass(selectee)"
          :style="getMaskStyle(selectee)"
          @dblclick="maskDblClick(selectee)"
        >
          <template v-if="!selectee.locked">
            <div class="lt resize-l resize-t" /><div class="rt resize-r resize-t" /><div class="t resize-t" /><div class="l resize-l" /><div class="lb resize-l resize-b" /><div class="rb resize-b resize-r" /><div class="r resize-r" /><div class="b resize-b" />
          </template>
        </div>
      </div>
      <!-- 拖拽选择层 -->
      <div class="dragging-rect" :style="styleDragingRect" />

      <!--缩放、平移操作区-->
      <el-button-group class="screen-actions">
        <el-button size="mini" icon="el-icon-minus" round @click="scaleDown" />
        <el-button size="mini">
          {{ scaleDisplay }}
        </el-button>
        <el-button size="mini" icon="el-icon-plus" @click="scaleUp" />
        <el-button size="mini" icon="el-icon-full-screen" @click="fitToCenter" />
        <el-button size="mini" icon="el-icon-s-grid" round @click="$emit('toggle-scenes')" />
      </el-button-group>
    </div>
  </div>
</template>

<script>
import { Button, ButtonGroup, Popover, Slider } from 'element-ui'
import workplaceMixins from './mixins/workplaceMixins'
import interact from 'interactjs'
import RenderElement from './render/RenderElement.vue'
import { shortid } from '../utils/string'
import { getSVGViewBox } from '../vectors/utils'
import interactMixins from './mixins/interactMixins.js'
import mouseMixins from './mixins/mousetrap.js'
import { fitRectIntoBounds, getRectPositionStyle, isPointInRect, intersectRect } from './mixins/rectUtils.js'
import textMesure from '../utils/textMesure'
const WORKSPACE_PADDING = 20
export default {
  name: 'SceneContainer',
  components: {
    RenderElement,
    [Slider.name]: Slider,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [ButtonGroup.name]: ButtonGroup
  },
  mixins: [ interactMixins, mouseMixins, workplaceMixins ],
  props: {
    // 格式刷模式
    paste: {
      type: Object
    },
    drawing: {
      type: Object
    },
    // 刷入的样式名称
    animation: {
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
      }
    }
  },

  computed: {
    viewBox () {
      return this.work.viewBox
    },
    viewPort () {
      return {
        width: this.work.viewBox.width * this.scale,
        height: this.work.viewBox.height * this.scale
      }
    },
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
        transform: `translateX(${this.translateX}px) translateY(${this.translateY}px)`, //scale(${this.scale})
        transformOrigin: 'top left',
        width: this.viewPort.width + 'px',
        height: this.viewPort.height + 'px',
        background: this.work.color,
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
      delete style.background
      return style
    },
    // 拖拽选择框的矩形样式
    styleDragingRect () {
      return {
        display: this.dragRect.visible ? 'inherit' : 'none',
        left: this.dragRect.left + 'px',
        top: this.dragRect.top + 'px',
        width: this.dragRect.width + 'px',
        height: this.dragRect.height + 'px'
      }
    },
    /**
     * 场景样式信息
     **/
    sceneStyle () {
      const styles = {
        '--vw': this.viewBox.width + 'px',
        '--vh': this.viewBox.height + 'px',
        width: this.work.viewBox.width + 'px',
        height: this.work.viewBox.height + 'px',
        perspective: this.work.viewBox.width + 'px'
      }
      return styles
    },
    /**
     * 选择的可活动元素
     **/
    selectedElements () {
      return this.scene.elements.filter(el => el.selected && !el.locked)
    }
  },

  watch: {
    scale () {

    },
    // 场景更新操作，需要更新交互及其他页面元素
    scene () {
      for (let element of this.scene.elements) {
        this.destroyInteract(element)
      }
      this.$nextTick(() => {
        for (let element of this.scene.elements) {
          this.destroyInteract(element)
        }
        this.setElementsInteract()
      })
    },
    'viewBox': {
      deep: true,
      handler () {
        this.fitToCenter()
      }
    },
    'animation': function (newVal, oldVal) {
      // 选择动效时 清除选定状态
      if (oldVal == null && newVal != null) {
        this.setElementSelected(null)
      }
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
      const fitSize = fitRectIntoBounds(this.viewBox, {
        width: this.workSpace.width - WORKSPACE_PADDING * 2,
        height: this.workSpace.height - WORKSPACE_PADDING * 2
      })
      // 自适应后，伸缩的比率
      this.scale = fitSize.width / this.viewBox.width
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
          if (event.ctrlKey) {
            this.actionMove = true
            this.dragRect.withCtrl = true
          } else {
            this.dragRect.withCtrl = false
          }
          this.dragRect.left = event.x0 - event.rect.left
          this.dragRect.top = event.y0 - event.rect.top
          if (this.actionMove) {
            this.dragRect.visible = false
          } else {
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
              this.dragRect.left = event.pageX - event.target.getBoundingClientRect().x
              this.dragRect.width = -this.dragRect.width
            }
            // 向上拖拽： 重新计算top
            if (this.dragRect.height < 0) {
              this.dragRect.top = event.pageY - event.target.getBoundingClientRect().y
              this.dragRect.height = -this.dragRect.height
            }

            // 判断矩形交叉的元素设置为选中
            this.dragRect.x = this.dragRect.left// - this.screenRect.x - this.screenRect.width / 2 * (1 - this.scale)
            this.dragRect.y = this.dragRect.top// - this.screenRect.y
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
          if (this.dragRect.withCtrl) {
            this.actionMove = false
            this.dragRect.withCtrl = false
          }
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
      if (ev.target.closest('.screen-actions')) {
        return
      }
      let targetElement = this.getEventToElement(ev)
      // 剪贴模式
      if (this.animation) {
        if (targetElement && !targetElement.locked) {
          this.$set(targetElement.animation, this.animation.stage, [{
            // css类名称
            name: this.animation.name,
            // 过渡函数，
            timing: this.animation.timing,
            // 时间区间 [0]为延迟，[1]为持续时间
            range: [parseInt(this.animation.delay), parseInt(this.animation.duration)]
          }])
        }
        this.animation.delay += this.animation.inc
      } else if (this.paste) {
        if (targetElement && !targetElement.locked) {
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
      console.log('target element', targetElement)
    },

    sceneMouseWheel (event) {
      if (event.ctrlKey) {
        if (event.deltaY < 0) {
          this.scaleUp()
        } else {
          this.scaleDown()
        }
      }
      console.log('wheel', event)
    },

    getEventToElement (ev) {
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
          // 获得最上层的未锁定的元素
          if (!element.locked) {
            targetElement = element
          }
        }
      }
      return targetElement
    },

    // Drag over and set as allow drop
    sceneDragOver (ev) {
      // let targetElement = this.getEventToElement(ev)
      // if (targetElement && !targetElement.locked) {
      //   this.$set(targetElement, 'hover', true)
      // }
      // for (let element of this.scene.elements) {
      //   if (element !== targetElement && element.hover) {
      //     this.$set(element, 'hover', false)
      //   }
      // }
      ev.preventDefault()
    },
    /**
     * 放置元素到页面
     */
    elementDropped (ev) {
      ev.preventDefault()
      const targetElement = this.getEventToElement(ev)
      const data = ev.dataTransfer.getData('Text')
      const element = JSON.parse(data)
      if (targetElement) {
        // targetElement.hover = false
        this.createNewElementFromTemplate(element, ev.offsetX + targetElement.x, ev.offsetY + targetElement.y)
      } else {
        this.createNewElementFromTemplate(element, ev.offsetX, ev.offsetY)
      }
    },

    createNewElementFromTemplate (element, x, y) {
      if (element.elements) {
        // 从模板创建  自动成为一个block
        this.createBlockFromTemplate(element, x, y)
      } else {
        // 单节点创建
        this.createSingleElement(element, x, y)
      }
    },

    replaceElement (element) {
      if (element.url && this.focusedElement && this.focusedElement.url) {
        for (let el of this.scene.elements) {
          if (el.url === this.focusedElement.url) {
            el.url = element.url
          }
        }
        this.focusedElement.url = element.url
      }
    },

    createSingleElement (element, x, y) {
      const id = shortid()
      // 此处设置节点的基本属性
      const node = {
        id,
        name: element.name || ('节点' + this.scene.elements.length + 1),
        width: 100,
        height: 100,
        // 样式信息
        style: {},
        variables: [],
        // 动效信息
        animation: {},
        // 其他属性，交互时使用
        locked: false,
        selected: false
      }
      Object.assign(node, element)
      // 设置文字的自适应大小
      if (element.text) {
        node.name = '文本'
        Object.assign(node, textMesure(element.text, element.variables.filter(variable => variable.type === 'fontSize')[0].value))
      }
      // image has mask attr
      if (element.url) {
        if (element.url.endsWith('.svg')) {
          element.fit = 'fill'
        } else {
          element.fit = 'cover'
          element.mask = ''
        }
      }
      if (element.ratio) {
        node.ratio = element.ratio
      }
      if (element.content && element._id) {
        node.svg = element._id
        node.content = element.content
      }
      // 获取元素自适应到整个画面的高度和宽度 避免扩大超出
      Object.assign(node, fitRectIntoBounds(node, this.viewBox))

      if (x && y) {
        // 拖拽处理
        node.x = x - node.width / 2
        node.y = y - node.height / 2
      }
      // 自动适应到屏幕内部 避免溢出
      node.x = (node.x < 0) ? 0 : node.x
      node.y = (node.y < 0) ? 0 : node.y

      this.scene.elements.push(node)
      this.setElementSelected(node)
      this.$emit('change')
      console.log('element dropped', node)
      this.$nextTick(() => {
        this.initElementDragResize(node)
      })
    },

    createBlockFromTemplate(element, x, y) {
      for (let frame in element.frames) {
        this.ctx.styleRegistry.addFrame({
          name: frame,
          cssFrame: element.frames[frame]
        })
      }
      const block = {
        id: shortid(),
        elements: element.elements,
        name: element.name,
        animation: {},
        selected: true,
        x: x,
        y: y,
        width: element.viewBox.width,
        height: element.viewBox.height
      }
      this.scene.elements.push(block)

      this.$nextTick( ()=> {
        this.initElementDragResize(block)
      })
    },

    /**
     * 初始化所有元素的interaction
     */
    setElementsInteract () {
      for (let element of this.scene.elements) {
        element.selected = false
        this.initElementDragResize(element)
      }
    },

    /**
     * 设置单个元素为选中状态, 取消其他元素选中
     */
    setElementSelected (element) {
      for (let e of this.scene.elements) {
        e.selected = false
        // 编辑状态时，如果被编辑元素被选中，则不改变编辑状态
        if (element !== e && e.editing) {
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
      // 锁定的元素 放置到最底层  操作最后
      if (element.locked) {
        displayStyle.zIndex = -1
      }
      return Object.assign(displayStyle, getRectPositionStyle(element, this.viewBox, this.viewPort))
    },

    applyFilter (filter) {
      if (this.focusedElement) {
        this.$set(this.focusedElement, 'filter', filter)
      }
    },

    getMaskClass (element) {
      const classes = []
      if (!element.selected) {
        classes.push('not-selected')
      } else if (element.editing) {
        classes.push('not-selected')
      } else {
        classes.push('selected')
      }
      if (element.hover) {
        classes.push('drag-hover')
      }
      return classes
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
        this.$emit('change')
        element.width = this.paste.width
        element.height = this.paste.height

        element.animation = JSON.parse(JSON.stringify(this.paste.animation))
        for (let key in this.paste.style) {
          if (element.style[key] != null) {
            if (typeof element.style[key] === 'object') {
              this.copyVariableValue(this.paste.style[key].variables, element.style[key].variables)
            } else {
              element.style[key] = this.paste.style[key]
            }
          }
        }
        element.variables = JSON.parse(JSON.stringify(this.paste.variables))
      }
    },

    setElementAnimation (element, animation) {
      const info = {
        // css类名称
        name: animation.name,
        // 过渡函数，
        timing: animation.timing,
        // 时间区间 [0]为延迟，[1]为持续时间
        range: [parseInt(animation.delay), parseInt(animation.duration)]
      }
      this.$set(element.animation, animation.type, [info])
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
#scene-container {
  flex: 1;
  overflow: hidden;
  width: 100%;
  .screen-actions {
    z-index: 1001;
    position: absolute;
    right: 20px;
    bottom: 20px;
    font-size: 16px;
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

  .scene {
    .element {
      position: absolute;
    }
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
    position: absolute;
    // cursor: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='%23515151' d='M746.667 341.333v85.334A42.667 42.667 0 0 1 704 469.333H149.333a42.667 42.667 0 0 1-42.666-42.666v-256A42.667 42.667 0 0 1 149.333 128H704a42.667 42.667 0 0 1 42.667 42.667V256H896a21.333 21.333 0 0 1 21.333 21.333v322.603a21.333 21.333 0 0 1-18.56 21.163l-472.106 61.568V896a21.333 21.333 0 0 1-21.334 21.333h-42.666A21.333 21.333 0 0 1 341.333 896V630.485a21.333 21.333 0 0 1 18.56-21.162L832 547.755V341.333h-85.333zM192 213.333V384h469.333V213.333H192z'/%3E%3C/svg%3E"), auto;
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
    &.drag-hover {
      background-color: rgba(66, 165, 245, 0.4);
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
