<template>
  <div id="tool-bar">
    <el-tooltip class="item" effect="dark" content="场景列表" placement="bottom">
      <a class="action" @click="$emit('toggle-show', 'sceneList')"><i class="el-icon-s-grid" /></a>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="元素列表" placement="bottom">
      <a class="action" @click="$emit('toggle-show', 'elementList')"><i class="el-icon-notebook-2" /></a>
    </el-tooltip>
    <el-tooltip v-show="focusedElement" class="item" effect="dark" content="动态效果" placement="bottom">
      <a class="action" @click="$emit('toggle-show', 'animation')"><i class="el-icon-data-line" /></a>
    </el-tooltip>
    <el-tooltip v-show="focusedElement" class="item" effect="dark" content="动态效果" placement="bottom">
      <a class="action" @click="$emit('toggle-show', 'elementProp')"><i class="el-icon-s-operation" /></a>
    </el-tooltip>
    <span class="separator" />
    <!--  样式变量的修改-->
    <template v-for="(variable, index) in elementStyleVariables">
      <!-- 颜色-->
      <el-color-picker v-if="variable.type==='color'" :key="index" v-model="variable.value" show-alpha :predefine="workColors" />
      <!-- 渐变颜色的处理-->
      <pop-set-gradient v-if="variable.type==='gradient'" :key="index" :variable="variable" />
      <!-- 数字-->
      <el-tooltip v-if="variable.type==='px' || variable.type==='number' || variable.type==='percent'" :key="index" content="数值">
        <el-input-number v-model="variable.value" controls-position="right" size="mini" />
      </el-tooltip>
      <!--边框样式-->
      <border-style v-if="variable.type==='border'" :key="index" :variable="variable" />
      <!--字体大小-->
      <font-size v-if="variable.type==='fontSize'" :key="index" :variable="variable" />

      <font-family v-if="variable.type === 'fontFamily'" :key="index" :variable="variable" />
      <!-- 字体对齐-->
      <text-align v-if="variable.type==='textAlign'" :key="index" v-model="variable.value" />
      <!-- 字体粗细-->
      <font-weight v-if="variable.type==='fontWeight'" :key="index" v-model="variable.value" />
    </template>

    <el-color-picker v-for="(path, index) in elementSVGPathColors" :key="index" v-model="path.f" show-alpha>
    </el-color-picker>
    <el-color-picker v-if="noFocusedElement" v-model="scene.color" show-alpha />
    <el-color-picker v-if="focusedElement && focusedElement.hasOwnProperty('fill')" v-model="focusedElement.fill" show-alpha />
    <!-- 右侧操作功能按钮-->
    <div class="pull-right">
      <align-element v-if="selectedElements.length > 1" :elements="selectedElements" />
      <el-tooltip v-if="selectedElements.length > 1" class="item" effect="dark" content="建组" placement="bottom">
        <a class="action" @click="groupSelectedElement"><i class="el-icon-folder-checked" /></a>
      </el-tooltip>
      <el-tooltip v-if="focusedElement && focusedElement.elements && focusedElement.elements.length" class="item" effect="dark" content="取消建组" placement="bottom">
        <a class="action on" @click="unGroupBlock"><i class="el-icon-folder-delete" /></a>
      </el-tooltip>
      <el-tooltip v-if="noFocusedElement" class="item" effect="dark" content="播放" placement="bottom">
        <a class="action" @click="playScene"><i class="el-icon-refresh-right" /></a>
      </el-tooltip>
      <el-tooltip v-if="noFocusedElement" class="item" effect="dark" content="离开" placement="bottom">
        <a class="action" @click="exitScene"><i class="el-icon-right" /></a>
      </el-tooltip>
      <el-tooltip v-if="noFocusedElement" class="item" effect="dark" content="预览" placement="bottom">
        <a class="action" @click="slidePreview"><i class="el-icon-video-play" /></a>
      </el-tooltip>
      <a class="action" @click="$emit('toggle-show', 'workProp')"><i class="el-icon-setting" /></a>
    </div>
  </div>
</template>

<script>
import { shortid } from '../../utils/string'
import interactMixins from '../mixins/interactMixins.js'
import toolbarPopMixin from './toolbarPopMixin'
import workMixin from '../mixins/workMixin'
import TextAlign from './TextAlign'
import FontWeight from './FontWeight'
import FontSize from './FontSize'
import AlignElement from './AlignElement.vue'
import FontFamily from './FontFamily.vue'
import PopSetGradient from './PopSetGradient'
import BorderStyle from './BorderStyle'
export default {
  name: 'Toolbar',
  components: {
    BorderStyle,
    PopSetGradient,
    AlignElement,
    FontSize,
    FontWeight,
    FontFamily,
    TextAlign
  },
  mixins: [ interactMixins, workMixin, toolbarPopMixin ],
  props: {
    scene: {
      type: Object
    },
    work: {
      type: Object
    },
    paste: {
      type: Object
    },
    scale: {
      type: Number,
      default: 1
    },
    undoable: {
      type: Boolean
    },
    redoable: {
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  computed: {
    scenes () {
      return this.work.scenes
    },
    elementSVGPathColors () {
      if (this.focusedElement) {
        const svg = this.focusedElement.svg || (this.focusedElement.mask && this.focusedElement.mask.svg)
        if (!svg) {
          return []
        }
        return svg.ps.filter(path => path.f)
      }
      return []
    },
    workColors () {
      const colors = []
      for (let scene of this.work.scenes) {
        for (let element of scene.elements) {
          if (element.variables) {
            for (let variable of element.variables) {
              if (variable.type === 'color') {
                colors.push(variable.value)
              }
            }
          }
        }
      }
      return Array.from(new Set(colors))
    },

    checkedElements () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected)
      }
      return []
    },

    noFocusedElement () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected).length === 0
      }
      return false
    },
    // 当前唯一选中的元素
    focusedElement () {
      if (this.selectedElements.length === 1) {
        return this.selectedElements[0]
      } else {
        return null
      }
    },

    elementMasktable () {
      if (this.focusedElement && !this.focusedFont) {
        return true
      } else {
        return false
      }
    },
    focusedFont () {
      return this.focusedElement &&  this.focusedElement.text != null
    },

    cleanable () {
      if (this.focusedElement) {
        return Object.entries(this.focusedElement.animation).length || this.focusedElement.style.clipPath
      } else {
        return false
      }
    },

    elementStyleVariables () {
      let variables = []
      if (this.focusedElement) {
        if (this.focusedElement.variables) {
          variables = variables.concat(this.focusedElement.variables)
        }
      }
      return variables
    },

    selectedElements () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && !el.locked)
      }
      return []
    },

    selectedLockedElements () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && el.locked)
      }
      return []
    },

    elementSelected () {
      return this.selectedElements.length > 0
    },

    selectedImages () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && !el.locked && el.url)
      }
      return []
    },
    selectedTexts () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && el.text != null)
      }
      return []
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

    backgroundToolbarVisible () {
      if (this.selectedElements.length) {
        let visible = false
        if (this.selectedElements[0].style.backgroundColor) {
          return true
        }
        return false
      } else {
        return true
      }
    },
    /**
     *工具栏之上的按钮样式
     */
    styleSelectedBackgroundStyle () {
      const style = {
        width: '24px',
        height: '24px',
      }
      for (let key in this.scene.style) {
        if (this.scene.style[key] && !this.scene.style[key].name) {
          Object.assign(style, {
            [key]: this.scene.style[key]
          })
        }
      }
      return style
    }
  },
  methods: {
    async slidePreview () {
      await this.saveWork()
      window.open('/slide/' + this.work.id)
    },
    togglePaste () {
      if (this.paste) {
        this.$emit('toggle-paste', null)
      } else {
        this.$emit('toggle-paste', this.focusedElement)
      }
    },
    sceneBackgroundChange (color) {
      this.scene.style.background = color
      this.ctx.palette = this.ctx.styleRegistry.getWorkColors(this.work)
    },
    elementBackgroundChange (color) {
      this.focusedElement.style.background = color
      this.ctx.palette = this.ctx.styleRegistry.getWorkColors(this.work)
    },
    variableColorInput (variable, color) {
      variable.value = color
    },
    setElementClipPath (clippath) {
      this.focusedElement.style.clipPath = clippath
    },
    /**
     * Group selected element to one block, remove element from scene.elements
     * Add block to scene.elements
     */
    groupSelectedElement () {
      const block = {
        id: shortid(),
        elements: [],
        name: '组合',
        props: {
          resizable: true,
          movable: true
        },
        style: {},
        animation: {},
        selected: false,
        // assign to the first of selected
        x: this.selectedElements[0].x,
        y: this.selectedElements[0].y,
        width: this.selectedElements[0].width,
        height: this.selectedElements[0].height
      }
      let blockRect = {
        x1: this.selectedElements[0].x,
        y1: this.selectedElements[0].y,
        x2: this.selectedElements[0].x + this.selectedElements[0].width,
        y2: this.selectedElements[0].y + this.selectedElements[0].height
      }
      // 1、loop to set block rect
      for (let element of this.selectedElements) {
        // get corner of element
        blockRect.x1 = Math.min(element.x, blockRect.x1)
        blockRect.y1 = Math.min(element.y, blockRect.y1)
        blockRect.x2 = Math.max(element.x + element.width, blockRect.x2)
        blockRect.y2 = Math.max(element.y + element.height, blockRect.y2)
        block.elements.push(element)
      }
      block.x = blockRect.x1
      block.y = blockRect.y1
      block.width = blockRect.x2 - blockRect.x1
      block.height = blockRect.y2 - blockRect.y1

      //2、loop to reset element rect
      for (let element of block.elements) {
        this.scene.elements.splice(this.scene.elements.indexOf(element), 1)
        element.x = element.x - block.x
        element.y = element.y - block.y
        element.selected = false
      }
      block.selected = true
      this.scene.elements.push(block)

      this.$nextTick( ()=> {
        this.initElementDragResize(block)
      })
    },

    unGroupBlock () {
      if (this.selectedElements.length === 1) {
        const block = this.selectedElements[0]
        this.destroyInteract(block)
        this.scene.elements.splice(this.scene.elements.indexOf(block), 1)
        for (let element of block.elements) {
          this.scene.elements.push(element)
          element.x = element.x + block.x
          element.y = element.y + block.y
          element.selected = true
        }
        this.$nextTick(() => {
          for (let element of block.elements) {
            this.initElementDragResize(element)
          }
        })
      }
    },

    openAnimationEdit () {
      this.$emit('show-animations')
    },
    toggleShowElementList () {
      this.$emit('show-elements')
    },
    toggleShowSceneList () {
      this.$emit('show-scenes')
    },

    openElementProperties () {
      this.$emit('show-element-prop')
    },

    exitScene () {
      for (let element of this.scene.elements) {
          element.stage = 'exit'
      }
      setTimeout(() => {
        this.scenes.visible = false
      }, this.scene.exit * 1000)

      setTimeout(() => {
        this.scenes.visible = true
        for (let element of this.scene.elements) {
          element.stage = ''
        }
      }, (this.scene.exit + 1) * 1000)
    },

    playScene () {
      const elements = this.scene.elements
      for (let element of this.scene.elements) {
          element.stage = ''
      }

      setTimeout(() => {
        for (let element of this.scene.elements) {
          element.stage = 'enter'
        }
      }, 400)

      setTimeout(() => {
        for (let element of this.scene.elements) {
          element.stage = ''
        }
      }, 400)
    },

    log () {
      console.log(this.selectedElements, this.scene, this.work)
    }
  }
}
</script>

<style lang="scss">
#tool-bar {
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  background: #fff;
  line-height: 28px;
  font-size: 12px;
  padding: 6px 12px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;
  .el-select {
    border: none;
    width: 64px;
    margin-right: 5px;
    margin-left: 5px;
  }
  .el-input-number--mini {
    width: 60px;
  }
  .el-color-picker__trigger {
    padding: 0;
    height: 28px;
    width: 28px;
    margin: 0 6px;
  }

  .separator {
    border-left: 1px solid #eee;
    padding-left: 10px;
  }
  i.action {
    width: 28px;
    height: 28px;
    margin: 0 6px;
    display: inline-block;
    border-radius: 4px;
    cursor: pointer;
    &:hover, &.on {
      cursor: pointer;
      box-shadow:inset 0 0 0 2px var(--mainColor);
    }
  }
  a.action {
    line-height: 28px;
    vertical-align: top;
    margin: 0 5px;
    color: #0e1318;
    font-size: 1.4rem;
    font-weight: 400;
    padding: 0 6px;
    display: inline-block;
    &:hover, &.on {
      cursor: pointer;
      background-color: #f1f3f4;
    }
    &.disabled {
     display: none;
    }
    i {
      font-size: 1.3rem;
    }
    img, svg {
      width: 18px;
      height: 28px;
      display: inline-block;
      vertical-align: top;
      &.wide {
        width: 26px;
      }
    }
    svg {
      path {
        fill: #515151;
      }
    }
  }
  .icon {
    background-size: 26px 26px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .pull-right {
    float: right;
    text-align: right;
    flex: 1;
    line-height: 28px;
  }
  .el-button {
    padding: 0;
  }
  span.info {
    line-height: 28px;
    width: 28px;
    text-align: center;
    display: inline-block;
    margin: 0 2px;
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
    vertical-align: top;
    padding: 0 5px;
  }
}


</style>
