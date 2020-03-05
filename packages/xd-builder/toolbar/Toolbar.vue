<template>
<div id="tool-bar">
  <keep-alive>
    <el-popover
      v-if="selectedElements.length || selectedTexts.length"
      placement="bottom-start"
      width="360"
      trigger="click">
      <a class="action" slot="reference">特效</a>
      <animation-tabs slot="default" :elements="this.selectedElements"/>
    </el-popover>
  </keep-alive>

  <!-- 给图片及文字设置边框 -->
  <keep-alive>
    <el-popover
      v-if="selectedImages.length"
      placement="bottom-start"
      width="360"
      trigger="click">
      <a class="action" slot="reference">边框</a>
      <border-list slot="default" :elements="this.selectedElements"/>
    </el-popover>
  </keep-alive>

  <keep-alive>
    <el-popover
      v-if="selectedElements.length"
      placement="bottom"
      width="200"
      trigger="click">
      <a class="action" slot="reference">变换</a>
    </el-popover>
  </keep-alive>

  <!-- 设置场景背景 -->
  <keep-alive>
    <el-popover
      v-if="scene && selectedElements.length === 0"
      placement="bottom-start"
      class="btn-action"
      width="200"
      trigger="click">
      <i class="icon icon-scene-bg" :class="sceneClass" slot="reference" :style="toolbarSceneBackgroundStyle"/>
    </el-popover>
  </keep-alive>

  <div class="pull-right">
    <a class="action" v-if="selectedElements.length > 1" @click="groupSelectedElement">组合</a>
    <a class="action" v-if="selectedElements.length === 1 && selectedElements[0].elements && selectedElements[0].elements.length" @click="unGroupBlock">取消组合</a>

    <el-popover
      v-if="selectedElements.length === 0"
      placement="bottom"
      width="200"
      trigger="click">
      <a class="action" slot="reference">缩放：{{scaleToolbarDisplay}}</a>
      <div>画面缩放</div>
      <el-slider
        v-model="scale"
        :min=".2"
        :max="2"
        :step="0.05"
        @input="scaleChange">
      </el-slider>
    </el-popover>
    <a class="action" v-if="selectedElements.length === 0" @click="previousScene"><i class="el-icon-arrow-up" /></a>
    <a class="action" v-if="selectedElements.length === 0" @click="nextScene"><i class="el-icon-arrow-down" /></a>
    <a class="action"> {{scenes.indexOf(scene) + 1}}/{{scenes.length}}</a>
    <a class="action" v-if="selectedElements.length === 0" @click="unGroupBlock"><i class="el-icon-setting" /></a>
  </div>
</div>
</template>

<script>
import { Button, ButtonGroup, Popover, Slider } from 'element-ui'
import AnimationTabs from './AnimationTabs.vue'
import BorderList from './BorderList'
import { shortid } from '../../utils/string'
import interactMixins from '../mixins/interactMixins.js'
export default {
  name: 'Toolbar',
  mixins: [ interactMixins ],
  components: {
    BorderList,
    AnimationTabs,
    [Slider.name]: Slider,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [ButtonGroup.name]: ButtonGroup
  },
  props: {
    scene: {
      type: Object
    },
    scenes: {
      type: Array
    }
  },
  data () {
    return {
      scale: 1
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
    selectedTexts () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && el.content != null)
      }
      return []
    },
    scaleToolbarDisplay () {
      return Math.floor(this.scale * 100) + '%'
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
    /**
     *工具栏之上的按钮样式
     */
    toolbarSceneBackgroundStyle () {
      const style = {
        width: '24px',
        height: '24px',
      }
      for (let key in this.scene.style) {
        if (this.scene.style[key] && !this.scene.style[key].name) {
          Object.assign(style, this.scene.style[key])
        }
      }
      return style
    }
  },
  methods: {
    /**
     * Group selected element to one block, remove element from scene.elements
     * Add block to scene.elements
     */
    groupSelectedElement () {
      const block = {
        id: shortid(),
        elements: [],
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
        this.initElementDrag(block)
      })
    },

    scaleChange () {
      this.$emit('scale-change', this.scale)
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

    previousScene () {

    },

    nextScene () {

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
  font-size: 12px;
  padding: 6px 12px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;

  a.action {
    line-height: 28px;
    cursor: pointer;
    margin: 0 2px;
    color: #0e1318;
    font-weight: 600;
    font-size: 1.4rem;
    padding: 0 5px;
    display: inline-block;
    &:hover, &.on {
      background-color: #f1f3f4;
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
  }
  .el-button {
    padding: 0;
  }
  .icon-scene-bg {
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  span.info {
    line-height: 28px;
    width: 28px;
    text-align: center;
    cursor: pointer;
    display: inline-block;
    margin: 0 2px;
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
    vertical-align: top;
    padding: 0 5px;
    &:hover, &.on {
      background-color: #f1f3f4;
    }
  }
  i {
    line-height: 28px;
    width: 28px;
    text-align: center;
    cursor: pointer;
    margin: 0 2px;
    color: rgba(0, 0, 0, 0.7);
    font-size: 18px;
    &:hover, &.on {
      background-color: #f1f3f4;
    }
  }
}


</style>
