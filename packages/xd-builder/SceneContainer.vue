<template>
<section id="right-section">
  <div class="tool-bar">
    <i class="el-icon-full-screen" v-if="selectedImages.length" @click="toggleBorderLayer"/>
  </div>
  <div id="scene-container" @click.exact="sceneMouseDown" ref="sceneContainer">
    <div class="screen" :style="styleScreen">
      <div class="screen-title">
      </div>
      <div class="scene" v-if="scene">
        <render-element
            v-for="(element, index) of scene.elements"
            stage="in"
            :element="element"
            :screen="screen"
            :key="element.id"
            :index="index"
            :ref="element.id"/>
      </div>
    </div>
    <div class="mask" :style="styleScreen" @dragover="sceneDragOver" @drop="elementDropped" v-if="scene">
      <div v-for="selectee in scene.elements" :ref="'mask-' + selectee.id" class="selected-node" :key="selectee.id" :style="getMaskStyle(selectee)">
        <div class="lt"/>
        <div class="rt"/>
        <div class="t"/>
        <div class="l"/>
        <div class="lb"/>
        <div class="rb"/>
        <div class="r"/>
        <div class="b"/>
      </div>
    </div>
    <div class="dragging-rect" :style="styleDragingRect">
    </div>
  </div>
  <div class="addon-container" v-show="currentAddon != null">
    <keep-alive>
      <addon-border-list :border="currentBorder" v-if="currentAddon === 'border'" @input="setSelectedBorder"/>
    </keep-alive>
  </div>
</section>
</template>

<script>
import { Button, ButtonGroup } from 'element-ui'
import interact from 'interactjs'
import RenderElement from './RenderElement.vue'
import AddonBorderList from './left/AddonBorderList.vue'
import { shortid } from '../utils/string'
import { fitRectIntoBounds, getRectPositionStyle, isPointInRect, intersectRect } from './mixins/rectUtils.js'

export default {
  name: 'SceneContainer',
  components: {
    RenderElement,
    AddonBorderList,
    [Button.name]: Button,
    [ButtonGroup.name]: ButtonGroup
  },
  props: {
    scene: {
      type: Object
    },
    screen: {
      type: Object
    }
  },

  data () {
    return {
      screenPosition: {
        x: 0,
        y: 0
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
      currentAddon: null,
      currentBorder: null
    }
  },

  watch: {
    'screen': {
      deep: true,
      handler () {
        this.fitToCenter()
      }
    }
  },

  computed: {
    selectedElements () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected)
      }
      return []
    },
    selectedImages () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && el.url)
      }
      return []
    },
    styleScreen () {
      return {
        left: this.screenRect.x + 'px',
        top: this.screenRect.y + 'px',
        width: this.screenRect.width + 'px',
        height: this.screenRect.height + 'px'
      }
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
    }
  },

  mounted () {
    this.fitToCenter()
    this.initGlobalInteract()
  },

  methods: {
    /**
     * 处理全局拖拽事件，全局拖拽主要负责元素拖拽多选选中处理
     */
    initGlobalInteract () {
      interact(this.$el).draggable({
        /**
         * 拖拽开始，如果只是点击不会触发拖拽事件。
         */
        onstart: event => {
          const containerRect = this.$refs.sceneContainer.getBoundingClientRect()
          this.dragRect.left = event.x0 - event.rect.left
          this.dragRect.top = event.y0 - event.rect.top - containerRect.y
          this.dragRect.visible = true
        },
        /**
         * 拖拽移动
         */
        onmove: event => {
          const containerRect = this.$refs.sceneContainer.getBoundingClientRect()
          // 计算正在拖拽的矩形区域
          this.dragRect.width = event.page.x - event.x0
          this.dragRect.height = event.page.y - event.y0
          if (this.dragRect.width < 0) {
            this.dragRect.left = (event.x0 - event.rect.left) + this.dragRect.width
            this.dragRect.width = -this.dragRect.width
          }
          if (this.dragRect.height < 0) {
            this.dragRect.top = (event.y0 - event.rect.top - containerRect.y) + this.dragRect.height
            this.dragRect.height = -this.dragRect.height
          }

          // 判断矩形交叉的元素设置为选中
          this.dragRect.x = this.dragRect.left - this.screenRect.x
          this.dragRect.y = this.dragRect.top - this.screenRect.y
          for (let element of this.scene.elements) {
            if (intersectRect(element, this.dragRect)) {
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
          x: ev.clientX - rootRect.x - this.screenRect.x,
          y: ev.clientY - rootRect.y - this.screenRect.y
        }
        // 判断点击处的元素
        let targetElement = null
        for (let element of this.scene.elements) {
          if (isPointInRect(point, element, 10)) {
            // 获取第一个 也就是最外层的
            targetElement = element
          }
        }
        this.mode = 'drag'
        this.setElementSelected(targetElement)
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
      // 获取元素自适应到整个画面的高度和宽度
      let { width, height } = fitRectIntoBounds(element, this.screen)
      const node = this.addNode()
      node.x = ev.offsetX - width / 2
      node.y = ev.offsetY - height / 2
      node.width = width
      node.height = height
      // 自动适应到屏幕内部 避免溢出
      node.x = (node.x < 0) ? 0 : node.x
      node.y = (node.y < 0) ? 0 : node.y
      if (element.url) {
        // 放置的图片
        node.url = element.url
        node.border = null
      }
      this.scene.elements.push(node)
      this.setElementSelected(node)
      this.initElementDrag(node)
    },

    /**
     * 增加一个节点
     */
    addNode () {
      const id = shortid()
      // 此处设置节点的基本属性
      const node = {
        id,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        selected: false
      }
      return node
    },

    /**
     * 初始化元素interact拖拽功能
     */
    initElementDrag (node) {
      this.$nextTick(() => {
        const el = this.$refs['mask-' + node.id]
        if (el.length) {
          interact(el[0]).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            inertia: true
          }).on('resizemove', event => {
            node.width = event.rect.width
            node.height = event.rect.height
            node.x += event.deltaRect.left
            node.y += event.deltaRect.top
          }).draggable({
            onstart: event => {},
            onmove: event => {
              for (let element of this.scene.elements) {
                if (element.selected) {
                  element.x += event.dx
                  element.y += event.dy
                }
              }
            },
            onend: event => {
              this.dragRect.dragged = true
            }
          })
        }
      })
    },

    /**
     * 设置单个元素为选中状态, 取消其他元素选中
     */
    setElementSelected (element) {
      for (let e of this.scene.elements) {
        e.selected = false
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
      if (!element.selected) {
        displayStyle.display = 'none'
      }
      return Object.assign(displayStyle, getRectPositionStyle(element))
    },
    // 显示左侧边框
    toggleBorderLayer () {
      this.currentAddon = 'border'
      if (this.selectedImages.length) {
        this.currentBorder = this.selectedImages[0].border
      }
    },

    // 增加样式
    setSelectedBorder (style) {
      for (let element of this.scene.elements) {
        if (element.selected) {
          element.border = {
            name: style.name,
            variables: style.variables
          }
        }
      }
      this.currentBorder = {
        name: style.name,
        variables: style.variables
      }
    },

    /**
     * 将屏幕放置到设计区正中央，同时修改屏幕位置偏移量
     */
    fitToCenter () {
      this.screenRect.width = this.screen.width
      this.screenRect.height = this.screen.height
      this.screenRect.x = (this.$refs.sceneContainer.clientWidth - this.screen.width) / 2
      this.screenRect.y = 80
    },
    getRectPositionStyle
  }
}
</script>

<style lang="scss">
#right-section {
  flex: 1;
  position: relative;
  touch-action: none;
  user-select: none;
  .tool-bar {
    z-index: 99999;
    position: absolute;
    width: 100%;
    height: 36px;
    background: #fff;
    top: 0;
    left: 0;
    i {
      line-height: 36px;
      padding: 0 10px;
      cursor: pointer;
      &:hover {

      }
    }
  }
  .addon-container {
    position: absolute;
    left: -352px;
    top: 0;
    bottom: 0;
    width: 352px;
    background: #fff;
    border-right: 1px solid #ededed;
  }
}
#scene-container {
  position: absolute;
  top: 36px;
  left: 0;
  width: 100%;
  bottom: 0;
  overflow: auto;
  .screen {
    position: absolute;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==");
    box-shadow: 0 0 6px #ddd;
  }
  .mask {
    position: absolute;
    z-index: 100;
    box-shadow: 0 0 0 1px #fff;
    .selected-node {
      position: absolute;
      border: 1px solid #42A5F5;
    }
  }
  .dragging-rect {
    z-index: 1000;
    position: absolute;
    border: 1px solid #42A5F5;
    background: #3366665e;
  }
  .selected-node {
    position: relative;
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
