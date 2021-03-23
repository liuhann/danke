<template>
  <div id="scene-container">
    <div id="workspace" ref="sceneContainer" :style="styleWorkContainer" @wheel.prevent="sceneMouseWheel" @mousedown="sceneMouseDown">
      <!-- 当前屏幕内容 -->
      <div class="screen" :style="styleScreen">
        <div v-if="scene" class="scene" :style="sceneStyle">
          <render-element v-for="(element, index) of scene.elements" :key="element.id"
                          :ref="element.id"
                          autoplay
                          :stage="scene.stage"
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
          :data-id="selectee.id"
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
      <!--组件快捷配置工具栏-->
      <div class="short-tools screen-actions">
        <el-form v-if="focusedElement" label-width="60px">
          <div class="form-title">元素设置</div>
          <el-form-item label="横坐标">
            <el-input-number v-model="focusedElement.x" size="mini" controls-position="right" />
          </el-form-item>
          <el-form-item label="纵坐标">
            <el-input-number v-model="focusedElement.y" size="mini" controls-position="right" />
          </el-form-item>
          <el-form-item label="宽度">
            <el-input-number v-model="focusedElement.width" size="mini" controls-position="right" />
          </el-form-item>
          <el-form-item label="高度">
            <el-input-number v-model="focusedElement.height" size="mini" controls-position="right" width="40px" />
          </el-form-item>
          <el-form-item label="旋转">
            <el-input-number v-model="focusedElement.rotate" size="mini" controls-position="right" />
          </el-form-item>
        </el-form>
        <el-form v-if="!focusedElement" label-width="60px">
          <div class="form-title">场景设置</div>
          <el-form-item label="操作">
            <el-button size="mini" icon="el-icon-full-screen" @click="fitToCenter" />
            <el-button size="mini" icon="fas fa-sync-alt" @click="playScene(scene)" />
          </el-form-item>

          <el-form-item label="缩放">
            <el-select v-model="scaleSelected" size="mini" style="width: 100px" allow-create filterable>
              <el-option-group>
                <el-option label="300%" :value="300"></el-option>
                <el-option label="200%" :value="200"></el-option>
                <el-option label="125%" :value="125"></el-option>
                <el-option label="100%" :value="100"></el-option>
                <el-option label="75%" :value="75"></el-option>
                <el-option label="50%" :value="50"></el-option>
                <el-option label="25%" :value="25"></el-option>
                <el-option label="10%" :value="10"></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="层次">
            <el-input-number v-model="scene.z" controls-position="right" size="mini" />
          </el-form-item>
          <el-form-item label="开始">
            <el-input-number v-model="scene.enter" controls-position="right" size="mini" /> ms
          </el-form-item>
          <el-form-item label="结束">
            <el-input-number v-model="scene.exit" controls-position="right" size="mini" /> ms
          </el-form-item>
          <el-form-item label="完成">
            <el-input-number v-model="scene.fin" controls-position="right" size="mini" /> ms
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, ButtonGroup, Popover, Slider } from 'element-ui'
import sceneEditContainer from './mixins/sceneEditContainer.js'
import interact from 'interactjs'
import RenderElement from './render/RenderElement.vue'
import interactMixins from './mixins/interactMixins.js'
import sceneMixins from './mixins/sceneMixins.js'
import mouseMixins from './mixins/mousetrap.js'
import { fitRectIntoBounds, getRectPositionStyle, isPointInRect, intersectRect } from './mixins/rectUtils.js'
import { setElementSelected, createSingleElement, playScene } from './utils/sceneActions.js'


export default {
  name: 'SceneContainer',
  components: {
    RenderElement,
    [Slider.name]: Slider,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [ButtonGroup.name]: ButtonGroup
  },
  mixins: [ interactMixins, mouseMixins, sceneEditContainer, sceneMixins ],
  props: {},
  data: function () {
    return {
      // 拖拽移动模式
      actionMove: false,
      scaleSelected: 100,
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
    scale () {
      return this.scaleSelected / 100
    },

    scaleDisplay () {
      return Math.floor(this.scale * 100) + '%'
    },
    styleScreen () {
      const screenStyle = {
        transform: `translateX(${this.translateX}px) translateY(${this.translateY}px)`, //scale(${this.scale})
        transformOrigin: 'center',
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
        width: this.viewBox.width + 'px',
        height: this.viewBox.height + 'px',
        perspective: this.viewBox.width + 'px',
        backgroundColor: this.scene.color
      }
      return styles
    }
  },

  watch: {
    'scaleSelected': function () {
      this.center()
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

  methods: {
    playScene,
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
      if (ev.target.className.indexOf('resize') > -1) {
        return
      }
      const targetElement = this.getEventToElement(ev)
      // 剪贴模式
      if (ev.ctrlKey) {
          this.appendElementSelected(targetElement)
      } else {
        if (this.selectedElements.length && this.selectedElements.indexOf(targetElement) > -1) {
          return
        }
        setElementSelected(this.scene, targetElement)
      }
      this.$emit('focus-change', targetElement)
    },

    getEventToElement (ev) {
      let element = null
      if (ev.target && ev.target.dataset.id) {
        element = this.scene.elements.filter(e => e.id === ev.target.dataset.id) [0]
      }
      return element
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
      const created = createSingleElement(element, this.work.viewBox, ev.offsetX / this.scale, ev.offsetY / this.scale)
      this.scene.elements.push(created)
      this.$nextTick(() => {
        this.initElementDragResize(created)
      })
      // this.createNewElementFromTemplate(element, )
    },
    /**
     * 初始化所有元素的interaction
     */
    setElementsInteract () {
      for (let element of this.scene.elements) {
        element.selected = false
        element.stage = 'enter'
        this.initElementDragResize(element)
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
    padding: 10px;
    background: #fff;
    z-index: 1001;
    box-shadow: #ddd 0px 1px 6px 0px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 16px;
    width: 200px;
    .el-form-item {
      margin-bottom: 5px;
    }
    .el-input__suffix {
      display: none;
    }
    .el-input__prefix {
      right: -40px;
      top: 4px;
    }
    .el-input-number {
      width: 72px;
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
      z-index: -1;
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
