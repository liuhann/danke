<template>
<section id="right-section">
  <!-- 工具栏 -->
  <div id="tool-bar">
    <!-- 设置元素边框 -->
    <i class="el-icon-copy-document" :class="currentAddon === 'border'? 'on': ''" v-if="selectedImages.length" @click="showAddon('border')"/>
    <!-- 设置元素动画 -->
    <i class="el-icon-magic-stick" v-if="selectedImages.length" @click="showAddon('animation')"/>
    <!-- 设置场景背景 -->
    <i class="el-icon-s-open" v-if="selectedImages.length === 0" @click="showAddon('background')"/>
    <!-- 设置场景动画 -->
    <i class="el-icon-magic-stick" v-if="selectedImages.length === 0" @click="toggleAnimationLayer()"/>
    <div class="pull-right" v-if="selectedImages.length === 0">
      <el-button icon="el-icon-arrow-down" type="text" size="mini" @click="nextScene">下页</el-button>
      <el-button icon="el-icon-arrow-up" type="text" size="mini" @click="prevScene">上页</el-button>
      {{scenes.indexOf(scene) + 1}}/{{scenes.length}}
      <i class="el-icon-upload" @click="saveWork"/>
      <i class="el-icon-setting" @click="saveWork"/>
      <i class="el-icon-data-line"  @click="playWork"/>
    </div>
  </div>
  <div id="scene-container" @click.exact="sceneMouseDown" ref="sceneContainer">
    <!-- 当前屏幕内容 -->
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
    <!-- 元素被选中、移动、调整大小时的选中层 -->
    <div class="mask" :style="styleScreen" @dragover="sceneDragOver" @drop="elementDropped" v-if="scene">
      <div
        v-for="selectee in scene.elements"
        :ref="'mask-' + selectee.id" class="node-mask"
        :key="selectee.id"
        :style="getMaskStyle(selectee)">
        <div class="lt"/><div class="rt"/><div class="t"/><div class="l"/><div class="lb"/><div class="rb"/><div class="r"/><div class="b"/>
      </div>
    </div>
    <!-- 拖拽选择层 -->
    <div class="dragging-rect" :style="styleDragingRect">
    </div>
  </div>
  <!-- 左侧的信息选择框 -->
  <div id="addon-container" v-show="currentAddon != null">
    <keep-alive>
      <addon-border-list :border="currentBorder" v-if="currentAddon === 'border'" @input="setSelectedBorder"/>
    </keep-alive>
    <keep-alive>
      <addon-animation-list v-if="currentAddon === 'enters' || currentAddon === 'exists'" @add="addAnimation"/>
    </keep-alive>
  </div>
  <!-- 显示当前元素的动画 -->
  <div class="animation-container">
    <animation-panel v-if="currentAddon === 'enters' || currentAddon === 'exists'"
      :trigger="currentAddon" @preview="previewAnimationSelection" :animations="currentEditAnimations" />
  </div>
</section>
</template>

<script>
import { Button, ButtonGroup } from 'element-ui'
import interact from 'interactjs'
import RenderElement from './RenderElement.vue'
import AddonBorderList from './border/AddonBorderList.vue'
import AddonAnimationList from './animation/AddonAnimationList.vue'
import AnimationPanel from './animation/AnimationPanel.vue'
import { shortid } from '../utils/string'
import { fitRectIntoBounds, getRectPositionStyle, isPointInRect, intersectRect } from './mixins/rectUtils.js'

export default {
  name: 'SceneContainer',
  components: {
    RenderElement,
    AddonBorderList,
    AddonAnimationList,
    AnimationPanel,
    [Button.name]: Button,
    [ButtonGroup.name]: ButtonGroup
  },
  props: {
    scenes: {
      type: Array
    },
    scene: {
      type: Object
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
      currentBorder: null,
      // 当前正在编辑的动画列表
      currentEditAnimations: null
    }
  },

  watch: {
    // 场景更新操作，需要更新交互及其他页面元素
    scene () {
      this.destoryElementInteract()
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

  mounted: function () {
    this.fitToCenter()
    this.initGlobalInteract()
  },

  methods: {
    /**
     * 将屏幕放置到设计区正中央，同时修改屏幕位置偏移量
     */
    fitToCenter () {
      this.screenRect.width = this.screen.width
      this.screenRect.height = this.screen.height
      this.screenRect.x = (this.$refs.sceneContainer.clientWidth - this.screen.width) / 2
      this.screenRect.y = 30
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
      const node = this.createElement()
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
      this.$nextTick(() => {
        this.initElementDrag(node)
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
     * 初始化元素interact拖拽功能
     */
    initElementDrag (node) {
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
          inertia: true,
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
    },

    /**
     * 销毁所有元素的interaction
     */
    destoryElementInteract () {
      for (let element of this.scene.elements) {
        const el = this.$refs['mask-' + element.id]
        if (el && el.length) {
          interact(el[0]).unset()
        }
      }
    },

    /**
     * 初始化所有元素的interaction
     */
    setElementsInteract () {
      for (let element of this.scene.elements) {
        this.initElementDrag(element)
      }
    },

    /**
     * 设置单个元素为选中状态, 取消其他元素选中
     */
    setElementSelected (element) {
      for (let e of this.scene.elements) {
        e.selected = false
      }
      this.currentAddon = null
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
      const border = style ? {
        name: style.name,
        variables: style.variables
      } : null
      for (let element of this.scene.elements) {
        if (element.selected) {
          element.style.border = border
        }
      }
      this.currentBorder = border
    },

    showAddon (addon) {
      switch (addon) {
        case 'border':
          if (this.selectedImages.length) {
            this.currentBorder = this.selectedImages[0].style.border
          }
          break
        case 'animation':
          if (this.selectedImages.length) {
            this.currentAnimation = this.selectedImages[0].style.animation
          }
          break
        case 'background':
          this.currentBackground = this.scene.background
          break
      }
      this.currentAddon = addon
    },

    // 切换到编辑动画模式
    toggleAnimationLayer (trigger) {
      this.currentAddon = trigger
      // 设置的是元素动画
      if (this.selectedImages.length) {
        if (!this.selectedImages[0][trigger]) {
          this.$set(this.selectedImages[0], trigger, [])
        }
        this.currentEditAnimations = this.selectedImages[0][trigger]
      } else {
        // 设置场景动画
      }
    },

    // 增加动画
    addAnimation (animation) {
      this.currentEditAnimations.push(animation)
      this.selectedElements[0].animations = this.currentEditAnimations
    },

    /**
     * 预览当前选中的元素
     * @param trigger  可以为enter和exist 表示进入和离开动画
     */
    previewAnimationSelection (trigger) {
      // 清空动画选项
      for (let element of this.scene.elements) {
        if (element.selected) {
          element.animations = []
        }
      }
      setTimeout(() => {
        for (let element of this.scene.elements) {
          if (element.selected) {
            element.animations = element[trigger]
          }
        }
      }, 200)
    },
    nextScene () {
      this.$emit('next-scene')
    },
    prevScene () {
      this.$emit('prev-scene')
    },
    // 播放作品
    playWork () {
      this.$emit('play-work')
    },
    // 播放作品
    saveWork () {
      this.$emit('save-work')
    }
  }
}
</script>

<style lang="scss">
#right-section {
  flex: 1;
  position: relative;
  touch-action: none;
  user-select: none;
  #tool-bar {
    z-index: 9999;
    position: absolute;
    width: 100%;
    height: 40px;
    background: #fff;
    font-size: 12px;
    padding: 6px;
    top: 0;
    left: 0;
    .pull-right {
      float: right;
    }
    .el-button {
      padding: 0;
    }
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;
    i {
      line-height: 28px;
      width: 28px;
      text-align: center;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.7);
      font-size: 18px;
      &:hover, &.on {
        background-color: #f1f3f4;
      }
    }
  }

  #addon-container {
    position: absolute;
    left: -352px;
    top: 0;
    bottom: 0;
    width: 352px;
    overflow: auto;
    background: #fff;
    border-right: 1px solid #ededed;
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
    }
    .dragging-rect {
      z-index: 1000;
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

  .animation-container {
    position: absolute;
    left: 0;
    top: 40px;
    background: #fff;
    width: 360px;
  }
}

</style>
