<template>
<div class="scene" :style="sceneStyle" @click.self="onSceneClicked">
  <vue-draggable-resizable v-for="(element, index) in scene.elements" :key="index" class="element-wrapper"
    drag-handle=".drag-handle"
    @activated="onElementClicked(index)"
    @resizing="onElementResizing"
    @dragging="onElementDraging"
    :ref="'element-' + index"
    :style="element.computedStyle"
    :class="[element.animationPreview, index===currentIndex?'current':'']">
    <div v-if="element.type==='image'" class="image drag-handle" :style="{
      backgroundImage: element.src
    }">
    </div>
    <div v-if="element.type === 'text'" class="text drag-handle" :style="{
      fontSize: element.font
    }">
      {{element.content}}
    </div>
    <div v-if="element.type === 'circle'" class="circle drag-handle">
    </div>
  </vue-draggable-resizable>
</div>
</template>

<script>
import VueDraggableResizable from 'vue\-draggable-resizable'
import EditElement from './forms/ConfigElement'
import '../animations/entrance.css'
import '../animations/exits.css'
import utils from '../utils/util'
import positionUtils from '../utils/position'

export default {
  name: 'Scene',
  components: {
    VueDraggableResizable,
    EditElement
  },
  props: {
    scene: {
      type: Object
    },
    device: {
      type: Object
    },
    styleName: {
      type: String
    }
  },

  watch: {

  },
  computed: {
    sceneStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },

  created () {
    this.nanobus.on('position-change', this.updateElementPosition)
  },

  data () {
    return {
      currentElement: null,
      currentIndex: -1
    }
  },
  methods: {

    // 增加一个element 
    addElement (element) {
      this.scene.elements.push(element)
      this.currentElement = null

      this.$nextTick(() => {
        this.updateElementPosition(element)
      })
    },

    // 更新指定element的位置和大小 创建或者box调整数据时
    updateElementPosition (element) {
      const pixels = positionUtils.toPixel(element, this.scene.coordinate, this.device)

      const index = this.scene.elements.indexOf(element)
      const targetDraggable = this.$refs['element-' + index][0]
      targetDraggable.top = pixels.x
      targetDraggable.left = pixels.y
      targetDraggable.width = pixels.w
      targetDraggable.height = pixels.h
    },

    generateEditSceneDataBinding () {
      for (let element of this.scene.elements) {
        const converted = this.convertPositionToPx(element, this.coordinate, this.device)
        element.xpx = converted.xpx
        element.ypx = converted.ypx
        element.wpx = converted.wpx
        element.hpx = converted.hpx
        // Object.assign(element, converted)
      }
      console.log('scene data binding changerd', this.scene)
      return this.scene
    },
    computeSceneStyle () {
      return utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate)
    },

    positioningCallback (val) {
      const converted = this.convertPositionToPx(val, this.coordinate, this.device)
      this.currentElement.xpx = converted.xpx
      this.currentElement.ypx = converted.ypx
      this.currentElement.wpx = converted.wpx
      this.currentElement.hpx = converted.hpx
    },

    onElementClicked (index) {
      this.currentIndex = index
      this.$emit('element-selected', index)
      this.currentElement = this.scene.elements[index]
      this.currentElement.changePosition = this.positioningCallback
    },
    onSceneClicked () {
      this.currentIndex = -1
      this.currentElement = null
      this.$emit('scene-selected')
    },
    /**
     * element resize时的回调, emit出位置信息
     */
    onElementResizing (left, top, width, height) {
      if (!this.currentElement) return
      this.$emit('positioning', {
        element: this.currentElement,
        newPos: {
          left, top, width, height
        }
      })
    },

    /**
     * element拖动时的回调, emit出位置信息
     */
    onElementDraging (left, top) {
      if (!this.currentElement) return
      this.$emit('positioning', {
        element: this.currentElement,
        newPos: {
          left, top
        }
      })
    }
  }
}
</script>

<style lang="less">
.scene {
  background-color: #fff;
  border: 1px solid #fefefe;
  border-radius: 10px;
  box-sizing: border-box;
  position: relative;
  .element-wrapper {
    position: absolute;
    box-sizing: border-box;
    &.current {
      border: 2px solid #4b0;
    }
    .van-icon-setting-o {
      position: absolute;
      right: 4px;
      top: -28px;
      font-size: 24px;
      color: #666;
    }
    &.selected {
      border: 1px solid #4B946A;
    }
    .image {
      width: 100%;
      height: 100%;
      background-color: #E4E4E4;
    }
  }
}
</style>
