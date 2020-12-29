<template>
  <div id="scene-edit-container">
    <div id="workspace" ref="sceneContainer" :style="styleWorkContainer">
      <!-- 当前屏幕内容 -->
      <div class="screen" :style="styleScreen">
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
          <render-scene v-if="backGroundScene" :scene="backGroundScene" :view-box="viewBox" :view-port="viewPort" />
        </div>
      </div>
      <!-- 元素被选中、移动、调整大小时的选中层 -->
      <div v-if="scene" class="mask" :style="styleMask">
        <div
          v-for="selectee in scene.elements"
          :id="'mask-' + selectee.id"
          :key="selectee.id"
          :data-id="selectee.id"
          class="node-mask"
          :class="getMaskClass(selectee)"
          :style="getMaskStyle(selectee)"
        >
          <template v-if="!selectee.locked">
            <div class="lt resize-l resize-t" /><div class="rb resize-b resize-r" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import interact from 'interactjs'
import Hammer from 'hammerjs'
import sceneEditContainer from '../xd-builder/mixins/sceneEditContainer'
import interactMixins from '../xd-builder/mixins/interactMixins'
import RenderElement from '../xd-builder/render/RenderElement.vue'
import { getBackGroundScene } from '../xd-builder/utils/workActions'
import RenderScene from '../xd-builder/render/RenderScene'

export default {
  name: 'SceneEditContainer',
  components: {
    RenderScene,
    RenderElement,
  },
  mixins: [ sceneEditContainer, interactMixins ],
  props: { },
  data: function () {
    return {
      dialogVisible: false,
      // 屏幕在工作区横向位置
      translateX: 0,
      // 屏幕区在工作区纵向位置
      translateY: 0,
      // 拖拽移动模式
      actionMove: false,
      // 屏幕区的位置
      screenRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    }
  },

  computed: {
    backGroundScene () {
      return getBackGroundScene(this.work, this.scene)
    },
    scaleDisplay () {
      return Math.floor(this.scale * 100) + '%'
    },
    styleScreen () {
      const screenStyle = {
        transform: `translateX(${this.translateX}px) translateY(${this.translateY}px)`, //scale(${this.scale})
        transformOrigin: 'top left',
        width: this.viewPort.width + 'px',
        height: this.viewPort.height + 'px',
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
      if (this.scene && this.scene.elements) {
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
      }
      return style
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
        backgroundColor: this.scene.color,
      }
      return styles
    }
  },

  watch: {
    // 场景更新操作，需要更新交互及其他页面元素
    scene () {
      // this.unSetElementsInteract()
      this.$nextTick(() => {
        // this.unSetElementsInteract()
        // this.setElementsInteract()
      })
    }
  },

  methods: {
    /**
     * 暂无
     */
    initGlobalInteract () {
      const mc = new Hammer.Manager(document.getElementById('scene-edit-container'))
      const Tap = new Hammer.Tap()
      mc.add(Tap);
      mc.on('tap', this.sceneMouseDown)

      // const Rotate = new Hammer.Rotate()
      // const Pan = new Hammer.Pan()
      // mc.add(Rotate);
      // mc.add(Pan);
      // mc.on('rotate', this.sceneRotate)
      // mc.on('rotatemove', this.sceneRotateMove)
      // mc.on('pinchstart', this.scenePinchStart)
      // mc.on('pinchmove', this.scenePinchMove)
      // mc.on('pan', this.moveSelectedElement)
      // mc.on('panstart', this.panStart)
    },


    sceneRotate (ev) {
      // 记录起始旋转时的角度
      if (this.focusedElement) {
        this.rotateStart = this.focusedElement.rotate || 0
      }
    },

    sceneRotateMove(ev) {
      if (this.focusedElement) {
        this.focusedElement.rotate = this.rotateStart + (ev.rotation / 2)
      }
    },

    scenePinchStart (ev) {
      // 记录缩放初始宽度、高度
      if (this.focusedElement) {
        this.pinchStartWidth = this.focusedElement.width
        this.pinchStartHeight = this.focusedElement.height
      }
    },

    scenePinchMove (ev) {
      if (this.focusedElement) {
        this.focusedElement.width = this.pinchStartWidth * ev.scale / 2
        this.focusedElement.height = this.pinchStartHeight * ev.scale / 2
      }
    },

    moveSelectedElement (ev) {
      // 点击Resize点返回
      if (ev.target.className.indexOf('resize') > -1) {
        return
      }
      if (this.selectedElements.length === 0) {
        return
      }

      for (let element of this.selectedElements) {
        element.x += ev.deltaX / this.scale
        element.y += ev.deltaY / this.scale
      }
    },
    /**
     * 进行鼠标点击位置检测，如果点击到元素则选中或保持多个的选择状态， 点到空白则取消所有元素选中
     */
    sceneMouseDown (ev) {
      if (ev.target.className.indexOf('resize') > -1) {
        return
      }
      const targetElement = this.getEventToElement(ev)

      // 当前元素正在被选中
      if (targetElement && this.focusedElement && targetElement.id === this.focusedElement.id) {
        return
      }

      // 设置选中
      this.setElementSelected(targetElement)

      // 取消现有的交互
      if (this.focusedElement) {
        this.destroyInteract(this.focusedElement)
      }

      if (targetElement) {
        this.initElementDragResize(targetElement)
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

    /**
     * 初始化所有元素的interaction
     */
    /*
    setElementsInteract () {
      if (this.scene && this.scene.elements) {
        for (let element of this.scene.elements) {
          element.selected = false
          element.stage = 'enter'
          this.initElementDragResize(element)
        }
      }
    },
    */

    initElementDragResize (node) {
      const el = document.getElementById('mask-' + node.id)
      if (el) {
        const interactee = interact(el)
        if (!interactee.resizable().enabled) {
          interactee.resizable({
            edges: {
              left: '.resize-l',
              right: '.resize-r',
              bottom: '.resize-b',
              top: '.resize-t'
            },
            preserveAspectRatio: node.isRatioFixed
          }).on('resizemove', event => {
            const target = {
              width: event.rect.width / this.scale,
              height: event.rect.height / this.scale,
              x: node.x + event.deltaRect.left / this.scale,
              y: node.y + event.deltaRect.top / this.scale
            }
            if (node.ratio) {
              target.height = target.width * node.ratio
            }
            if (node.elements && node.elements.length) {
              this.resizeBlockElements(node, target)
            }
            Object.assign(node, target)
          }).on('resizeend', event => {
            this.$emit('change')
          })
        }
        if (!interactee.draggable().enabled) {
          interactee.draggable({
            onstart: event => {
            },
            onmove: event => {
              for (let element of this.selectedElements) {
                element.x += event.dx / this.scale
                element.y += event.dy / this.scale
              }
            },
            onend: event => {
              this.$emit('change')
            }
          })
        }

        interactee.gesturable({
          listeners: {
            start : evt => {
              node._start = {
                width: node.width,
                height: node.height,
                angle: evt.angle
              }
            },
            move: evt => {
              // 处理角度
              node.rotate += evt.da / 2
              node.width += (node._start.width * evt.ds / 2 > 10) ? 10 : (node._start.width * evt.ds)
              node.height += (node._start.height * evt.ds / 2 > 10) ? 10: (node._start.height * evt.ds)
            },
            end (event) {
              delete node._start
            }
          }
        })
      }
    },

    /**
     * 卸载初始化所有元素的interaction
     */
    unSetElementsInteract () {
      if (this.scene && this.scene.elements) {
        for (let element of this.scene.elements) {
          this.destroyInteract(element)
        }
      }
    },

    /**
     * 获取遮罩的样式，对于未选中的设置为display: none
     */
    getMaskStyle (element) {
      const displayStyle = {
        touchAction: 'none'
      }
      // 锁定的元素 放置到最底层  操作最后
      if (element.locked) {
        displayStyle.zIndex = -1
      }
      // if (element.selected) {
      //   displayStyle.zIndex = 110
      // }
      return Object.assign(displayStyle, this.getRectPositionStyle(element, this.viewBox, this.viewPort), {
        transform: `rotate(${element.rotate}deg)`
      })
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


    removeElement (element) {
      this.scene.elements.splice(this.scene.elements.indexOf(element), 1)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
#scene-edit-container {
  height: 100%;
  overflow: hidden;
  position: relative;
  .screen {
    position: absolute;
    box-shadow: 0 0 6px #ddd;
    overflow: hidden;
    background-image: linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef),
    linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
  }

  .scene {
    .element {
      position: absolute;
    }
  }
  .mask {
    position: absolute;
    z-index: 10;
    box-shadow: 0 0 0 1px #fff;
  }

  .node-mask {
    position: absolute;
    &.not-selected {
      border: 1px solid transparent;
      >div {
         opacity: 0;
      }
    }
    &.selected {
      border: 1px solid #42A5F5;
      >div {
        opacity: 1;
      }
    }
    &.drag-hover {
      background-color: rgba(66, 165, 245, 0.4);
    }
    >div {
      border: 1px solid #42A5F5;
      border-radius: 20px;
      width: 20px;
      height: 20px;
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
      left: -10px;
      top: -10px;
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
      right: -10px;
      bottom: -10px;
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
