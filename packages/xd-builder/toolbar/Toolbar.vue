<template>
<div id="tool-bar">
  <!--  样式变量的修改-->
  <template v-for="(variable, index) in elementStyleVariables">
    <!-- 颜色-->
    <color-pop-picker :key="index" v-if="variable.type==='color'" :color="variable.value" model="color" @input="variableColorInput(variable, $event)"/>
    <!-- 数字-->
    <el-input-number :key="index" v-if="variable.type==='number'" v-model="variable.value" controls-position="right" size="mini"/>
    <!-- 文字大小 -->
    <el-select
      :key="index"
      v-if="variable.type==='fontSize'"
      v-model="variable.value"
      size="mini"
      filterable
      allow-create
      placeholder="字体">
      <el-option
        v-for="item in fontSizeOptions"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <!-- 字体对齐-->
    <text-align :key="index" v-if="variable.type==='textAlign'" v-model="variable.value"/>
    <!-- 字体粗细-->
    <font-weight :key="index" v-if="variable.type==='fontWeight'" v-model="variable.value"/>
  </template>

  <!--元素动画效果设置-->
  <pop-set-animation v-if="focusedElement" :element="focusedElement"/>
  <!--整体场景的动画效果-->
  <pop-set-animation v-if="selectedElements.length === 0" :element="scene"/>

  <!--元素变换、旋转、拉伸等-->
  <pop-transform v-if="focusedElement" :element="focusedElement"/>
  <pop-clip-list v-if="focusedElement && focusedElement.style && focusedElement.style.clipPath != null" @input="setElementClipPath"/>
  <pop-transparent :element="focusedElement" v-if="focusedElement"/>

  <!-- 多选的对齐、平均分布功能-->
  <a class="action" v-if="selectedElements.length > 1" @click="alignLeft"><img :src="ICON_ALIGN_LEFT"></a>
  <a class="action" v-if="selectedElements.length > 1" @click="alignRight"><img :src="ICON_ALIGN_RIGHT"></a>
  <a class="action" v-if="selectedElements.length > 1" @click="alignTop"><img :src="ICON_ALIGN_TOP"></a>
  <a class="action" v-if="selectedElements.length > 1" @click="alignBottom"><img :src="ICON_ALIGN_BOTTOM"></a>
  <a class="action" v-if="selectedElements.length > 1" @click="alignVerCenter"><img :src="ICON_ALIGN_VER_CENTER"></a>
  <a class="action" v-if="selectedElements.length > 1" @click="alignHorCenter"><img :src="ICON_ALIGN_HOR_CENTER"></a>
  <a class="action" v-if="selectedElements.length > 2" @click="alignAverVer"><img :src="ICON_ALGIN_AVER_VER"></a>
  <a class="action" v-if="selectedElements.length > 2" @click="alignAverHor"><img :src="ICON_ALGIN_AVER_HOR"></a>

  <!-- 右侧操作功能按钮-->
  <div class="pull-right">
    <a class="action" v-if="!elementSelected && undoable" @click="$emit('undo')"><img :src="ICON_UNDO"></a>
    <a class="action" v-if="!elementSelected && redoable" @click="$emit('redo')"><img :src="ICON_REDO"></a>
    <a class="action" :class="paste? 'on': ''" v-if="focusedElement" @click="togglePaste"><img :src="ICON_BRUSH"></a>
    <a class="action" v-if="selectedElements.length > 0" @click="copySelectedElement"><img :src="ICON_COPY"></a>
    <a class="action" v-if="selectedElements.length > 1" @click="groupSelectedElement"><img :src="ICON_GROUPING"></a>
    <a class="action on" v-if="focusedElement && focusedElement.elements && focusedElement.elements.length" @click="unGroupBlock"><img :src="ICON_GROUPING"></a>
    <a class="action" v-if="selectedElements.length" @click="removeSelectedElement"><img :src="ICON_TRASH"></a>
    <a class="action" v-if="selectedElements.length === 0" @click="previousScene"><i class="el-icon-arrow-up" /></a>
    <a class="action" v-if="selectedElements.length === 0" @click="nextScene"><i class="el-icon-arrow-down" /></a>
    <a class="action" v-if="selectedElements.length === 0"> {{scenes.indexOf(scene) + 1}}/{{scenes.length}}</a>
    <pop-more-action :element="focusedElement" :scene="scene" v-if="focusedElement" @reset="resetElementDragResize"/>
    <el-popover v-if="selectedElements.length === 0" placement="bottom" width="360" trigger="click" popper-class="padding-0">
      <a class="action" slot="reference"><i class="el-icon-setting" /></a>
      <setting-panel :work="work"/>
    </el-popover>
  </div>
</div>
</template>

<script>
import { Button, ButtonGroup, Popover, Slider, Select, Option, Tooltip, InputNumber } from 'element-ui'
import fontMixin from './fontMixin'
import BorderList from './BorderList'
import { shortid } from '../../utils/string'
import interactMixins from '../mixins/interactMixins.js'
import SettingPanel from './SettingPanel'
import ColorPopPicker from './ColorPopPicker'
import PopClipList from './PopClipList'
import PopSetAnimation from './PopSetAnimation'
import PopMoreAction from './PopMoreAction'
import PopTransparent from './PopTransparent'
import ICON_BRUSH from './res/brush.svg'
import ICON_GROUPING from './res/grouping.svg'
import ICON_COPY from './res/copy.svg'
import ICON_TRASH from './res/trash.svg'
import ICON_UNDO from './res/undo.svg'
import ICON_REDO from './res/redo.svg'
import ICON_ALIGN_LEFT from './res/align-left.svg'
import ICON_ALIGN_RIGHT from './res/align-right.svg'
import ICON_ALIGN_TOP from './res/align_top.svg'
import ICON_ALIGN_BOTTOM from './res/align-bottom.svg'
import ICON_ALIGN_CENTER from './res/align-center.svg'
import ICON_ALIGN_VER_CENTER from './res/align-vertical.svg'
import ICON_ALIGN_HOR_CENTER from './res/align-horizontal.svg'
import ICON_ALGIN_AVER_HOR from './res/align-aver-h.svg'
import ICON_ALGIN_AVER_VER from './res/align-aver-v.svg'

import PopTransform from './PopTransform'
import TextAlign from './TextAlign'
import FontWeight from './FontWeight'
export default {
  name: 'Toolbar',
  mixins: [ interactMixins, fontMixin ],
  components: {
    FontWeight,
    TextAlign,
    PopTransform,
    PopTransparent,
    PopMoreAction,
    PopSetAnimation,
    PopClipList,
    ColorPopPicker,
    SettingPanel,
    [Tooltip.name]: Tooltip,
    [Select.name]: Select,
    [Option.name]: Option,
    [Slider.name]: Slider,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [InputNumber.name]: InputNumber,
    [ButtonGroup.name]: ButtonGroup
  },
  props: {
    scene: {
      type: Object
    },
    scenes: {
      type: Array
    },
    work: {
      type: Object
    },
    paste: {
      type: Object
    },
    scale: {
      type: Number
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
      ICON_TRASH,
      ICON_BRUSH,
      ICON_UNDO,
      ICON_REDO,
      ICON_GROUPING,
      ICON_COPY,
      ICON_ALIGN_LEFT,
      ICON_ALIGN_RIGHT,
      ICON_ALIGN_TOP,
      ICON_ALIGN_BOTTOM,
      ICON_ALIGN_CENTER,
      ICON_ALIGN_VER_CENTER,
      ICON_ALIGN_HOR_CENTER,
      ICON_ALGIN_AVER_HOR,
      ICON_ALGIN_AVER_VER,
    }
  },
  computed: {
    // 当前唯一选中的元素
    focusedElement () {
      if (this.selectedElements.length === 1) {
        return this.selectedElements[0]
      } else {
        return null
      }
    },
    focusedFont () {
      return this.focusedElement &&  this.focusedElement.text != null
    },

    elementStyleVariables () {
      let variables = []
      if (this.focusedElement) {
        if (this.focusedElement.variables) {
          variables = variables.concat(this.focusedElement.variables)
        }
        for (let key in this.focusedElement.style) {
          if (typeof this.focusedElement.style[key] === 'object' && this.focusedElement.style[key].variables) {
            variables = variables.concat(this.focusedElement.style[key].variables)
          }
        }
      } else {
        for (let key in this.scene.style) {
          if (this.scene.style[key].variables) {
            variables = variables.concat(this.scene.style[key].variables)
          }
        }
      }
      return variables
    },

    selectedElements () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected)
      }
      return []
    },

    elementSelected () {
      return this.selectedElements.length > 0
    },

    selectedImages () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && el.url)
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
    copySelectedElement () {
      // 拷贝元素
      for (let element of this.selectedElements) {
        element.selected = false
        const cloned = JSON.parse(JSON.stringify(element))
        cloned.id = shortid()
        cloned.selected = true
        cloned.x += 10
        cloned.y += 10
        this.scene.elements.push(cloned)
        this.$nextTick( ()=> {
          this.initElementDragResize(cloned)
        })
      }
    },

    removeSelectedElement () {
      for (let element of this.selectedElements) {
        element.selected = false
        this.scene.elements.splice(this.scene.elements.indexOf(element), 1)
      }
      this.$emit('change')
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
          resizable: false,
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
      // 1、loop to set block rect
      for (let element of this.selectedElements) {
        // get corner of element
        const x1 = element.x
        const y1 = element.y
        const x2 = element.x + element.width
        const y2 = element.y + element.height

        // check out and resize block size
        if (x1 < block.x) {
          block.x = x1
        }
        if (y1 < block.y) {
          block.y = y1
        }
        if (x2 > block.x + block.width) {
          block.width = x2 - block.x
        }
        if (y2 > block.y + block.height) {
          block.height = y2 - block.y
        }
        block.elements.push(element)
      }

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
    alignLeft () {
      let leftPos = null
      for (let element of this.selectedElements) {
        if (leftPos === null) {
          leftPos = element.x
        } else {
          element.x = leftPos
        }
      }
    },
    alignRight () {
      let rightPos = null
      for (let element of this.selectedElements) {
        if (rightPos === null) {
          rightPos = element.x + element.width
        } else {
          element.x = rightPos - element.width
        }
      }
    },
    alignTop () {
      let topPos = null
      for (let element of this.selectedElements) {
        if (topPos === null) {
          topPos = element.y
        } else {
          element.y = topPos
        }
      }
    },

    alignHorCenter () {
      let center = null
      for (let element of this.selectedElements) {
        if (center === null) {
          center = element.x + element.width / 2
        } else {
          element.x = center - element.width / 2
        }
      }
    },

    // 竖向平分
    alignAverHor () {
      const dup = []
      for (let element of this.selectedElements) {
        dup.push(element)
      }

      dup.sort((a, b) => a.x - b.x)
      const min = dup[0].x
      const max = dup[dup.length -1].x

      for (let i = 0; i < dup.length; i++) {
        dup[i].x = min + i * (max - min) / (dup.length - 1)
      }
    },

    // 橫向平分
    alignAverVer () {
      const dup = []
      for (let element of this.selectedElements) {
        dup.push(element)
      }

      dup.sort((a, b) => a.y - b.y)
      const min = dup[0].y
      const max = dup[dup.length -1].y

      for (let i = 0; i < dup.length; i++) {
        dup[i].y = min + i * (max - min) / (dup.length - 1)
      }
    },

    // 橫向居中
    alignVerCenter () {
      let center = null
      for (let element of this.selectedElements) {
        if (center === null) {
          center = element.y + element.height / 2
        } else {
          element.y = center - element.height / 2
        }
      }
    },

    alignBottom () {
      let bottomPos = null
      for (let element of this.selectedElements) {
        if (bottomPos === null) {
          bottomPos = element.y + element.height
        } else {
          element.y = bottomPos - element.height
        }
      }
    },
    log () {
      console.log(this.selectedElements, this.scene, this.work)
    },

    previousScene () {
      this.$emit('prev-scene')
    },

    nextScene () {
      this.$emit('next-scene')
    }
  }
}
</script>

<style lang="scss">
.toolbar-pop {
  max-height: calc(100vh - 77px);
  overflow-y: auto;
}
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
  }
  .el-input-number--mini {
    width: 60px;
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
      vertical-align: text-bottom;
      font-size: 1.8rem;
      font-weight: bold;
    }
    img {
      width: 18px;
      height: 28px;
      display: inline-block;
      vertical-align: top;
    }
  }
  .icon {
    background-size: 26px 26px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .icon-border {
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cpath d='M288 288v48h-48v-80a16 16 0 0 1 16-16h80v48h-48zm0 448h48v48h-80a16 16 0 0 1-16-16v-80h48v48zm448-448h-48v-48h80a16 16 0 0 1 16 16v80h-48v-48zm0 448v-48h48v80a16 16 0 0 1-16 16h-80v-48h48zM160 128h704a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32zm32 64v640h640V192H192z' fill='rgba(0,%200,%200,%200.7)'/%3E%3C/svg%3E");
  }
  .icon-enter {
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cpath d='M570.496 723.2L364.16 829.995l39.424-226.176-166.955-160.214 230.699-33.024L570.496 204.8l103.21 205.781 230.7 33.024L737.45 603.82l39.424 226.176L570.496 723.2zm-329.13-518.4H460.8v43.221H241.365V204.8zm-43.82 107.99h219.307v43.22H197.547v-43.263zM153.6 636.8h175.53v43.179H153.6V636.8zm0 107.99h175.53v43.22H153.6v-43.22z' fill='rgba(0,%200,%200,%200.7)'/%3E%3C/svg%3E");
  }
  .icon-crop {
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cpath d='M284 128c-15.4 0-28 12.6-28 28v40c0 15.4 12.6 28 28 28s28-12.6 28-28v-40c0-15.4-12.6-28-28-28zm28 556V380c0-15.4-12.6-28-28-28s-28 12.6-28 28v332c0 31 25 56 56 56h332c15.4 0 28-12.6 28-28s-12.6-28-28-28H340c-15.4 0-28-12.6-28-28zm556 28h-40c-15.4 0-28 12.6-28 28s12.6 28 28 28h40c15.4 0 28-12.6 28-28s-12.6-28-28-28z' fill='%230e1318'/%3E%3Cpath d='M128 284c0 15.4 12.6 28 28 28h528c15.4 0 28 12.6 28 28v528c0 15.4 12.6 28 28 28s28-12.6 28-28V312c0-31-25-56-56-56H156c-15.4 0-28 12.6-28 28z' fill='rgba(0,%200,%200,%200.7)'/%3E%3C/svg%3E");
  }
  .icon-leave {
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cpath d='M298.923 196.096l83.84 140.8-140.8-83.84 56.96-56.96zm-126.55 473.173l-20.906-77.909 163.84-2.176-142.976 80zm599.894-473.216l56.96 56.96-140.8 83.798 83.84-140.8zm107.05 470.016l-142.976-80 163.84 2.176-20.906 77.824zM495.02 887.467l32.853-132.011 32.939 132.01h-65.792z' fill='%230e1318'/%3E%3Cpath d='M525.483 677.035l188.501 98.773-36.01-209.237L830.42 418.389l-210.688-30.506L525.44 197.46l-94.25 190.422-210.646 30.506 152.448 148.182-36.01 209.237 188.5-98.773zm0 31.317L300.117 826.453l43.051-250.197-182.357-177.237 251.989-36.48 112.64-227.584 112.683 227.584 252.032 36.48-182.4 177.237 43.093 250.197-225.365-118.101z' fill='%230e1318'/%3E%3Cpath d='M507.264 570.752h9.472l66.688 33.152-13.653-75.136 57.045-52.608-78.89-10.837L512 396.373l-35.925 68.907-78.891 10.837 57.003 52.608-13.611 75.136 66.688-33.152zm-95.232 71.21l19.115-105.471-81.707-75.264 112.768-15.488L512 350.25l49.75 95.445 112.767 15.488-81.664 75.307 19.115 105.472L512 592.213l-99.968 49.75z' fill='rgba(0,%200,%200,%200.7)' opacity='.4'/%3E%3C/svg%3E");
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
