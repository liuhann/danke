<template>
  <div id="tool-bar">
    <div class="pull-left">
      <el-tooltip v-show="focusedElement" class="item" effect="dark" content="动态效果" placement="bottom">
        <a class="action" @click="$emit('command', 'anime', focusedElement)"><i class="fa fa-random" /></a>
      </el-tooltip>
      <a v-show="focusedElement" class="action" @click="$emit('command', 'style', focusedElement)"><i class="fab fa-css3" /></a>
      <a v-show="focusedElement" class="action" @click="$emit('command', 'stager', focusedElement)"><i class="fas fa-braille"></i></a>
      <!--  样式变量的修改-->
      <template v-for="(variable, index) in elementStyleVariables">
        <!-- 颜色-->
        <el-color-picker v-if="variable.type==='color'" :key="index" v-model="variable.value" show-alpha :predefine="workColors" />
        <!-- 渐变颜色的处理-->
        <pop-set-gradient v-if="variable.type==='gradient'" :key="index" :variable="variable" />
        <!-- 数字-->
        <el-input-number v-if="variable.type==='px' || variable.type==='number' || variable.type==='percent'" :key="index" v-model="variable.value" controls-position="right" size="mini" />
        <!--边框样式-->
        <border-style v-if="variable.type==='border'" :key="index" :variable="variable" />
        <font-family v-if="variable.type === 'font-familly'" :key="index" :variable="variable" />
        <!-- 字体对齐-->
        <text-align v-if="variable.type==='textAlign'" :key="index" v-model="variable.value" />
        <!-- 字体粗细-->
        <font-weight v-if="variable.type==='fontWeight'" :key="index" v-model="variable.value" />
      </template>
    </div>

    <el-color-picker v-for="(path, index) in elementSVGPathColors" :key="index" v-model="path.f" show-alpha />
    <el-color-picker v-if="focusedElement && focusedElement.hasOwnProperty('fill')" v-model="focusedElement.fill" show-alpha />
    <align-element v-if="selectedElements.length > 1" :elements="selectedElements" />
    <!-- 右侧操作功能按钮-->
    <div class="pull-right">
      <!-- <align-element v-if="selectedElements.length > 1" :elements="selectedElements" /> -->
      <el-tooltip v-if="selectedElements.length > 1" class="item" effect="dark" content="建组" placement="bottom">
        <a class="action" @click="groupSelectedElement"><i class="el-icon-folder-checked" /></a>
      </el-tooltip>
      <el-tooltip v-if="focusedElement && focusedElement.elements && focusedElement.elements.length" class="item" effect="dark" content="取消建组" placement="bottom">
        <a class="action on" @click="unGroupBlock"><i class="el-icon-folder-delete" /></a>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="元素列表" placement="bottom">
        <a class="action" @click="$emit('command', 'element-list')"><i class="fa fa-list-ul" /></a>
      </el-tooltip>
      <span class="separator" />
      <el-tooltip class="item" effect="dark" content="前一页" placement="bottom">
        <a class="action" @click="$emit('command', 'prev-scene')"><i class="fa fa-chevron-left" /></a>
      </el-tooltip>
      <a class="action" @click="$emit('command', 'scene-list')">
        <i class="fa fa-list-alt" />
        <span class="text">{{ sceneIndex }}/{{ work.scenes.length }}页面</span>
      </a>
      <el-tooltip class="item" effect="dark" content="后一页" placement="bottom">
        <a class="action" @click="$emit('command', 'next-scene')"><i class="fa fa-chevron-right" /></a>
      </el-tooltip>
      <a class="action" @click="$emit('command', 'add-scene')"><i class="el-icon-plus" /></a>
    </div>
  </div>
</template>

<script>
import { shortid } from '../../utils/string'
import interactMixins from '../mixins/interactMixins.js'
import sceneMixins from '../mixins/sceneMixins.js'
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
  mixins: [ interactMixins, sceneMixins ],
  props: {
    scene: {
      type: Object
    },
    work: {
      type: Object
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


    elementStyleVariables () {
      let variables = []
      if (this.focusedElement) {
        if (this.focusedElement.variables) {
          variables = variables.concat(this.focusedElement.variables)
        }
      }
      return variables
    }
  },
  methods: {
    async slidePreview () {
      await this.saveWork()
      window.open('/slide/' + this.work.id)
    },

    showAllScenesPop () {
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
  padding: 0 12px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;
  border-bottom: 1px solid #eee;
  .el-select {
    margin-right: 5px;
    margin-left: 5px;
    vertical-align: top;
    .el-select-dropdown__item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-input-number--mini {
    width: 60px;
    vertical-align: top;
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
  a.action {
    margin: 0 5px;
    color: #0e1318dc;
    font-size: 18px;
    font-weight: normal;
    width: 30px;
    height: 30px;
    text-align: center;
    &:hover, &.on {
      cursor: pointer;
      background-color: #f1f3f4;
    }
    &.disabled {
     display: none;
    }
    svg {
      width: 24px;
      height: 24px;
    }
    .text {
      font-size: 16px;
      line-height: 28px;
      display: inline-block;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
  .icon {
    background-size: 26px 26px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center center;
    svg {
      width: 24px;
      height: 24px;
    }
  }
  .pull-left {
    display: flex;
    align-items: center;
  }
  .pull-right {
    flex-direction: row-reverse;
    align-items: center;
    display: flex;
    flex: 1;
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
