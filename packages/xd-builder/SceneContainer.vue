<template>
<section id="scene-container" @mousedown.exact="sceneMouseDown">
  <div class="screen" :style="styleScreen">
    <div class="scene" v-if="scene">
      <render-element
          v-for="(element, index) of scene.elements"
          stage="in"
          :element="element"
          :key="element.id"
          :index="index"
          :ref="element.id"/>
    </div>
  </div>
  <div class="mask" :style="styleScreen" @dragover="sceneDragOver" @drop="elementDropped" v-if="scene">
    <div v-for="selectee in scene.elements" :ref="'mask-' + selectee.id" class="selected-node" :key="selectee.id" :style="getMaskStyle(selectee)">
    </div>
  </div>
  <div class="dragging-rect" :style="styleDragingRect">
  </div>
</section>
</template>

<script>
import interact from 'interactjs'
import RenderElement from './RenderElement.vue'
import { shortid } from '../utils/string'
import { fitRectIntoBounds, getRectPositionStyle, isPointInRect } from './mixins/rectUtils.js'
export default {
  components: {
    RenderElement
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
      selectedElements: []
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
     * 处理全局拖拽事件，全局拖拽主要负责
     * 1 元素拖拽多选选中处理
     */
    initGlobalInteract () {
      interact(this.$el).draggable({
        /**
         * 拖拽开始，如果只是点击不会触发拖拽事件。
         */
        onstart: event => {
          // 在mousedown时已经处理过
          this.dragRect.left = event.x0 - event.rect.left
          this.dragRect.top = event.y0 - event.rect.top
          this.dragRect.visible = true
        },
        onmove: event => {
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
          console.log('drag move', event)
        },
        onend: event => {
          this.dragRect.visible = false
          console.log('drag end', event)
        }
      }).styleCursor(false)
    },
    /**
     * 进行鼠标点击位置检测，如果点击到元素则选中或保持多个的选择状态， 点到空白则取消所有元素选中
     */
    sceneMouseDown (ev) {
      // 设计区点转换为相对于屏幕的点
      const rootRect = this.$el.getBoundingClientRect()
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
      if (targetElement === null) {
        // 无选择元素
        this.setElementSelected(null)
      } else if (this.selectedElements.indexOf(targetElement) > -1) {
        // 当前元素已经被选择
        // 区域切换到移动模式
        this.mode = 'move'
      } else {
        this.setElementSelected(targetElement)
      }
      console.log('mouse down', ev)
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
        node.url = element.url
      }
      this.setElementSelected(node)
    },

    /**
     * 增加一个节点
     */
    addNode () {
      const id = shortid()
      const node = {
        id,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        selected: false
      }
      this.scene.elements.push(node)

      this.$nextTick(() => {
        const el = this.$refs['mask-' + id]
        if (el.length) {
          interact(el[0]).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            inertia: true
          }).on('resizemove', event => {
            node.width = event.rect.width
            node.height = event.rect.height
            node.x += event.deltaRect.left
            node.y += event.deltaRect.top
            console.log(node)
          })
        }
      })
      return node
    },

    appendElementSelected (element) {
      this.selectedElements.push(element)
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

    /**
     * 将屏幕放置到设计区正中央，同时修改屏幕位置偏移量
     */
    fitToCenter () {
      this.screenRect.width = this.screen.width
      this.screenRect.height = this.screen.height
      this.screenRect.x = (this.$el.clientWidth - this.screen.width) / 2
      this.screenRect.y = 20
      console.log(this.$el.clientWidth, this.$el.clientHeight)
    },
    getRectPositionStyle
  }
}
</script>

<style lang="scss">
#scene-container {
  position: relative;
  touch-action: none;
  user-select: none;
  flex: 1;
  .screen {
    position: absolute;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==");
    box-shadow: 0 0 6px #ddd;
  }
  .mask {
    position: absolute;
    box-shadow: 0 0 0 1px #fff;
    .selected-node {
      position: absolute;
      border: 1px solid #42A5F5;
    }
  }
  .dragging-rect {
    position: absolute;
    border: 1px solid #42A5F5;
    background: #3366665e;
  }
}
</style>
