<template>
  <div id="scene-edit-container">
    <div id="workspace" ref="sceneContainer" :style="styleWorkContainer" @touchstart="sceneMouseDown" @mousedown="sceneMouseDown">
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
    <el-dialog
      :visible.sync="dialogVisible"
      height="90%"
      width="95%"
    >
      <DIV slot="title">
        <el-button type="text" icon="el-icon-unlock"></el-button>
        <el-button type="text" plain icon="el-icon-delete"></el-button>
      </DIV>
      <el-form v-if="element" label-width="80px">
        <el-form-item v-for="(variable, index) in element.variables || []" :key="index" :label="getVariableLabel(variable)">
          <el-color-picker v-if="variable.type==='color'" v-model="variable.value" />
          <font-family v-if="variable.type === 'fontFamily'" :key="index" :variable="variable" />
          <text-align v-if="variable.type==='textAlign'" :key="index" v-model="variable.value" />
          <font-weight v-if="variable.type==='fontWeight'" :key="index" v-model="variable.value" />
          <font-size v-if="variable.type==='fontSize'" :key="index" :variable="variable" />
          <el-input-number v-if="variable.type==='px' || variable.type==='number' || variable.type==='percent'" v-model="variable.value" />
        </el-form-item>
        <el-form-item v-if="element.hasOwnProperty('fill')" label="填充色">
          <el-color-picker v-model="element.fill" show-alpha />
        </el-form-item>
        <el-form-item label="旋转">
          <el-slider v-model="element.rotate" :max="360" :show-tooltip="false"></el-slider>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import interact from 'interactjs'
import sceneEditContainer from '../xd-builder/mixins/sceneEditContainer'
import FontFamily from '../xd-builder/toolbar/FontFamily'
import FontWeight from '../xd-builder/toolbar/FontWeight'
import TextAlign from '../xd-builder/toolbar/TextAlign'
import FontSize from '../xd-builder/toolbar/FontSize'
import interactMixins from '../xd-builder/mixins/interactMixins'
import RenderElement from '../xd-builder/render/RenderElement.vue'
import { shortid } from '../utils/string'

export default {
  name: 'SceneEditContainer',
  components: {
    RenderElement,
    FontWeight,
    FontSize,
    FontFamily,
    TextAlign
  },
  mixins: [ sceneEditContainer, interactMixins ],
  props: {
    scene: {
      type: Object
    }
  },
  data: function () {
    return {
      dialogVisible: false,
      element: null,
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
        backgroundColor: this.scene.color
      }
      return styles
    }
  },

  watch: {
    // 场景更新操作，需要更新交互及其他页面元素
    scene () {
      this.unSetElementsInteract()
      this.$nextTick(() => {
        this.unSetElementsInteract()
        this.setElementsInteract()
      })
    }
  },

  methods: {
    /**
     * 暂无
     */
    initGlobalInteract () {},

    getVariableLabel(variable) {
      if (variable.label) {
        return variable.label
      }
      if (variable.type === 'color') {
        return '颜色'
      }
      if (variable.type === 'number') {
        return '设置长度'
      }
      if (variable.type === 'fontFamily') {
        return '字体'
      }
      return variable.type
    },

    /**
     * 进行鼠标点击位置检测，如果点击到元素则选中或保持多个的选择状态， 点到空白则取消所有元素选中
     */
    sceneMouseDown (ev) {
      if (ev.target.className.indexOf('resize') > -1) {
        return
      }
      const targetElement = this.getEventToElement(ev)
      this.setElementSelected(targetElement)
      this.$emit('focus-change', targetElement)
    },

    getEventToElement (ev) {
      let element = null
      if (ev.target && ev.target.dataset.id) {
        element = this.scene.elements.filter(e => e.id === ev.target.dataset.id) [0]
      }
      return element
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
      const targetElement = this.getEventToElement(ev)
      const data = ev.dataTransfer.getData('Text')
      const element = JSON.parse(data)
      if (targetElement) {
        console.log('target element', targetElement)
        // targetElement.hover = false
        this.createNewElementFromTemplate(element, ev.offsetX / this.scale + targetElement.x, (ev.offsetY / this.scale + targetElement.y))
      } else {
        this.createNewElementFromTemplate(element, ev.offsetX / this.scale, ev.offsetY / this.scale)
      }
    },

    createNewElementFromTemplate (element, x, y) {
      let node = null
      if (element.elements) {
        // 从模板创建  自动成为一个block
        node = this.createBlockFromTemplate(element, x, y)
      } else {
        // 单节点创建
        node = this.createSingleElement(element, x, y)
      }
      if (node) {
        this.$nextTick( ()=> {
          this.initElementDragResize(node)
        })
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
      return block
    },

    /**
     * 初始化所有元素的interaction
     */
    setElementsInteract () {
      if (this.scene && this.scene.elements) {
        for (let element of this.scene.elements) {
          element.selected = false
          element.stage = 'enter'
          this.initElementDragResize(element)
        }
      }
    },

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
            onstart: event => {},
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
        interactee.on('hold', event => {
          this.element = node
          this.dialogVisible = true
          console.log('hold', node)
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
      return Object.assign(displayStyle, this.getRectPositionStyle(element, this.viewBox, this.viewPort))
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
    }

  }
}
</script>

<style lang="scss">
#scene-edit-container {
  height: 100%;

  .el-form-item {
    margin-bottom: 5px;
    border-bottom: 1px solid #e0e0e0;
    height: 44px;
    line-height: 44px;

    .action {
      line-height: 44px;
      margin: 0 5px;
      color: #0e1318;
      font-weight: 400;
      padding: 0 6px;

      svg {
        width: 18px;
        height: 28px;
        display: inline-block;
        vertical-align: text-bottom;
      }
    }
}

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
