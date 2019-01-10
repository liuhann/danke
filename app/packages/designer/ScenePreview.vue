<template>
<div class="scene" :style="sceneStyle">
  <div v-for="(element, index) in scene.elements" :key="index" class="element-wrapper"
    @click="onElementClicked(index)"
    :style="element.computedStyle"
    :ref="'element-' + index"
    :class="[element.animationPreview, index===currentIndex?'current':'']">
    <div v-if="element.type==='image'" class="image">
      {{element.src?'': '未选择图片'}}
    </div>
    <div v-if="element.type === 'text'" class="text" :style="{
      fontSize: element.font
    }">
      {{element.content}}
    </div>
    <div v-if="element.type === 'circle'" class="circle">
    </div>
  </div>
</div>
</template>

<script>
import EditElement from './forms/ConfigElement'
import '../animations/entrance.css'
import '../animations/exits.css'
import utils from '../utils/util'
import positionUtils from '../utils/position'
import styleUtils from '../utils/styles'

export default {
  name: 'Scene',
  components: {
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
    'scene.elements': function(newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  },
  computed: {
    sceneStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    },
    currentScene () {
      for (let element of this.scene.elements) {
        element.computedStyle = styleUtils.getElementStyle(element, this.d)
      }
      return this.scene
    }
  },

  created () {
    this.nanobus.on('position-change', this.updateElementPosition.bind(this))
    this.nanobus.on('element-change', this.updateElementStyle.bind(this))
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
      this.currentElement = element
      this.currentIndex = this.scene.elements.length - 1
      this.addingElement = true

      this.$nextTick(() => {
        this.addingElement = false
        this.updateElementPosition(element)
      })
    },

    // 更新指定element的位置和大小 创建或者box调整数据时
    updateElementPosition (element) {
      const pixels = positionUtils.toPixel(element, this.scene.coordinate, this.device)
      // const index = this.scene.elements.indexOf(element)
      const targetDraggable = this.$refs['element-' + this.currentIndex][0]
      targetDraggable.top = pixels.y
      targetDraggable.left = pixels.x
      targetDraggable.width = pixels.w
      targetDraggable.height = pixels.h
    },

    // 更新element的样式信息
    updateElementStyle (element) {
      const style = styleUtils.getElementStyle(element, this.device)
      this.currentElement.computedStyle = style
    },

    computeSceneStyle () {
      return utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate)
    },

    onElementClicked (index) {
      this.currentIndex = index
      this.currentElement = this.scene.elements[index]
      this.$emit('element-selected', this.currentElement)
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
      if (!this.currentElement || this.addingElement) return
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
      if (!this.currentElement || this.addingElement) return
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
  position: relative;
  .element-wrapper {
    position: absolute;
    box-sizing: border-box;
    &.current {
      border: 1px solid #4B946A;
    }
    .van-icon-setting-o {
      position: absolute;
      right: 4px;
      top: -28px;
      font-size: 24px;
      color: #666;
    }
    .image {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #efefef;
    }
  }
}
</style>
