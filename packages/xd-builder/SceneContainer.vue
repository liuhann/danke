<template>
<div class="scene-wrapper">
  <div id="workspace" @click="sceneMouseDown" ref="sceneContainer" :style="styleWorkSpace">
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
            :key="element.id"
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
        :style="getMaskStyle(selectee)">
        <div class="lt"/><div class="rt"/><div class="t"/><div class="l"/><div class="lb"/><div class="rb"/><div class="r"/><div class="b"/>
      </div>
    </div>
    <!-- 拖拽选择层 -->
    <div class="dragging-rect" :style="styleDragingRect" />
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
    scale: {
      type: Number
    },
    screen: {
      type: Object
    }
  },
  data: function () {
    return {
      screenPosition: {
        x: 0,
        y: 0
      },
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
      currentAddonObject: null
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
    styleWorkSpace() {
      return {
        width: this.workSpace.width + 'px',
        height: this.workSpace.height + 'px'
      }
    },
    styleScreen () {
      return {
        fontSize: '10px',
        transform: 'scale(' + this.scale + ')',
        transformOrigin: 'top center',
        left: this.screenRect.x + 'px',
        top: this.screenRect.y + 'px',
        width: this.screenRect.width + 'px',
        height: this.screenRect.height + 'px'
      }
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
      for (let key in this.scene.style) {
        if (this.scene.style[key] && !this.scene.style[key].name) {
          Object.assign(styles, {
            [key]: this.scene.style[key]
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
    }
  },

  mounted: function () {
    this.fitToCenter()
    this.initGlobalInteract()
    this.setElementsInteract()
  },

  methods: {
    /**
     * 将屏幕放置到设计区正中央，同时修改屏幕位置偏移量
     */
    fitToCenter () {
      const fitSize = fitRectIntoBounds(this.screen, {
        width: this.$el.clientWidth - 60,
        height: this.$el.clientHeight - 60
      })
      const screenRatio = fitSize.width / this.screen.width
      this.workSpace.width = this.$el.clientWidth / screenRatio
      this.workSpace.height = this.$el.clientHeight / screenRatio
      this.screenRect.width = this.screen.width
      this.screenRect.height = this.screen.height
      this.screenRect.x = (this.workSpace.width - this.screen.width) / 2
      this.screenRect.y = (this.workSpace.height - this.screen.height) / 2
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
          this.dragRect.left = event.x0 - event.rect.left
          this.dragRect.top = event.y0 - event.rect.top
          this.dragRect.visible = true
        },
        /**
         * 拖拽移动
         */
        onmove: event => {
          // const containerRect = this.$refs.sceneContainer.getBoundingClientRect()
          // 计算正在拖拽的矩形区域
          this.dragRect.width = event.page.x - event.x0
          this.dragRect.height = event.page.y - event.y0
          if (this.dragRect.width < 0) {
            this.dragRect.left = (event.x0 - event.rect.left) + this.dragRect.width
            this.dragRect.width = -this.dragRect.width
          }
          if (this.dragRect.height < 0) {
            this.dragRect.top = (event.y0 - event.rect.top) + this.dragRect.height
            this.dragRect.height = -this.dragRect.height
          }

          // 判断矩形交叉的元素设置为选中
          this.dragRect.x = this.dragRect.left - this.screenRect.x - this.screenRect.width / 2 * (1 - this.scale)
          this.dragRect.y = this.dragRect.top - this.screenRect.y
          for (let element of this.scene.elements) {
            if (intersectRect({
              x: element.x * this.scale,
              y: element.y * this.scale,
              width: element.width * this.scale,
              height: element.height * this.scale
            }, this.dragRect)) {
              element.selected = true
            } else {
              element.selected = false
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
      if (!this.dragRect.dragged) {
        // 设计区点转换为相对于屏幕的点
        const rootRect = this.$refs.sceneContainer.getBoundingClientRect()
        // 点位置计算 clientX - 容器X - 屏幕X
        const point = {
          x: ev.clientX - rootRect.x - this.$refs.sceneContainer.scrollLeft - this.screenRect.x - this.screenRect.width / 2 * (1 - this.scale),
          y: ev.clientY - rootRect.y - this.$refs.sceneContainer.scrollTop - this.screenRect.y
        }
        // 判断点击处的元素
        let targetElement = null
        for (let element of this.scene.elements) {
          if (isPointInRect(point, {
            x: element.x * this.scale,
            y: element.y * this.scale,
            width: element.width * this.scale,
            height: element.height * this.scale
          }, 10)) {
            // 获取第一个 也就是最外层的
            targetElement = element
          }
        }
        this.mode = 'drag'
        if (ev.ctrlKey) {
          this.appendElementSelected(targetElement)
        } else {
          this.setElementSelected(targetElement)
        }
      }
      this.currentAddon = null
      this.dragRect.dragged = false
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

      if (element.width && element.height) {
        // 获取元素自适应到整个画面的高度和宽度
        const fit = fitRectIntoBounds(element, this.screen)
        width = fit.width
        height = fit.height
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
        style: {},
        prop: {},
        selected: false
      }
      return node
    },

    /**
     * 初始化所有元素的interaction
     */
    setElementsInteract () {
      for (let element of this.scene.elements) {
        if (element.elements) {
          this.initElementDrag(element)
        } else {
          this.initElementDragResize(element)
        }
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
      this.currentAddon = null
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
      this.currentAddon = null
    },

    /**
     * 获取遮罩的样式，对于未选中的设置为display: none
     */
    getMaskStyle (element) {
      const displayStyle = {}
      if (!element.selected) {
        displayStyle.display = 'none'
      } else {
        if (element.editing) {
          displayStyle.display = 'none'
        }
      }
      return Object.assign(displayStyle, getRectPositionStyle(element))
    },

    /**
     * 切换到选中元素的设置样式模式
     * @param addon 样式名称
     */
    showAddon (addon) {
      if (this.selectedImages.length) {
        this.currentAddonObject = this.selectedImages[0].style[addon]
      } else {
        this.currentAddonObject = this.scene.style[addon]
      }
      this.currentAddon = addon
    },

    /**
     * 设置当前属性的配置值
     */
    setElementAddon (addon) {
      if (this.selectedElements.length) {
        for (let element of this.selectedElements) {
          this.$set(element.style, this.currentAddon, addon)
        }
      } else {
        this.$set(this.scene.style, this.currentAddon, addon)
      }
      this.currentAddonObject = addon
    },

    /*
     * 增加动画到配置面板，同时更新选择的元素的动画效果
     */
    addAnimation (animation) {
      if (this.currentAddonObject == null) {
        this.currentAddonObject = []
      }
      this.currentAddonObject.push(animation)
      if (this.selectedElements.length) {
        for (let element of this.selectedElements) {
          this.$set(element, 'animations', this.currentAddonObject)
          this.$set(element.style, this.currentAddon, this.currentAddonObject)
        }
      }
    },

    maskDblClick (element) {
      if (element.text) {
        this.$set(element, 'editing', true)
      }
    },
    /**
     * 预览当前选中的元素的动画效果
     */
    previewAnimationSelection () {
      // 清空动画选项
      this.selectedElements.forEach(element => {
        element.animations = []
      })
      setTimeout(() => {
        this.selectedElements.forEach(element => {
          element.animations = this.currentAddonObject
        })
      }, 200)
    }
  }
}
</script>

<style lang="scss">
.scene-wrapper {
  flex: 1;
  overflow: auto;
  width: 100%;
}
#workspace {
  position: relative;
  .screen {
    position: absolute;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==");
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
    border: 1px solid #42A5F5;
    >div {
      border: 1px solid #42A5F5;
      width: 8px;
      height: 8px;
      background-color: #fff;
      position: absolute;
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
