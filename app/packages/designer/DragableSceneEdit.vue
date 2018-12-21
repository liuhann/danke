<template>
<div class="scene" :style="sceneStyle" @click.self="onSceneClicked">
  <vue-draggable-resizable v-for="(element, index) in sceneConfig.elements" :key="index" class="element-wrapper"
    drag-handle=".drag-handle"
    @activated="onElementClicked(index)"
    @resizing="onElementResizing"
    @dragging="onElementDraging"
    :class="[element.animationPreview]">
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
import VueDraggableResizable from 'vue-draggable-resizable'
import EditElement from './forms/ConfigElement'
import '../animations/entrance.css'
import '../animations/exits.css'
import utils from '../utils/util'

export default {
  name: 'Scene',
  components: {
    VueDraggableResizable,
    EditElement
  },
  props: {
    checkable: {
      type: Boolean,
      default: false
    },
    scene: {
      type: Object
    },
    device: {
      type: Object
    },
    coordinate: {
      type: String,
      default: 'tl'
    },
    styleName: {
      type: String
    }
  },

  watch: {
    scene: {
      handler (val) {
        this.generateEditSceneDataBinding()
      },
      deep: true
    }
  },
  computed: {
    sceneStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
    // sceneConfig () {
    //   // const sceneConfig = utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate, this.styleName)
    //   return this.generateEditSceneDataBinding(this.scene)
    // }
  },

  created () {
    // this.sceneConfig = utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate, this.styleName)
  },

  data () {
    return {
      sceneConfig: this.generateEditSceneDataBinding(),
      showElementEditBox: false,
      currentElement: null,
      currentIndex: -1
    }
  },
  methods: {
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
    onConfigElement () {
      this.showElementEditBox = true
    },
    closeElementConfig () {
      this.showElementEditBox = false
    },
    onElementClicked (index) {
      this.currentIndex = index
      this.$emit('element-selected', index)
      this.currentElement = this.scene.elements[index]
    },
    onSceneClicked () {
      this.currentIndex = -1
      this.currentElement = null
      this.showElementEditBox = false
      this.$emit('scene-selected')
    },

    onElementResizing (left, top, width, height) {
      if (!this.currentElement) return
      this.reversePosition(this.currentElement, {
        left, top, width, height
      }, this.coordinate, this.device)
    },

    onElementDraging (left, top) {
      if (!this.currentElement) return
      this.reversePosition(this.currentElement, {
        left, top
      }, this.coordinate, this.device)
    },

    // 将vh、vw定位转换为px 定位
    convertPositionToPx (element, coordinate, device) {
      const result = {}
      if (coordinate === 'center') {
        result.xpx = device.width / 2 + parseInt(utils.getLength(element.x, device))
      } else {
        result.xpx = parseInt(utils.getLength(element.x, device))
      }

      if (coordinate === 'center') {
        result.ypx = device.height / 2 + parseInt(utils.getLength(element.y, device))
      } else {
        result.ypx = parseInt(utils.getLength(element.y, device))
      }
      result.wpx = parseInt(utils.getLength(element.width, device))
      result.hpx = parseInt(utils.getLength(element.height, device))
      return result
    },

    reversePosition (element, newPos, coordinate, device) {
      if (newPos.left) {
        if (coordinate === 'center') {
          element.x = this.setLenFromPx(newPos.left - device.width / 2, element.x, device)
        } else {
          element.x = this.setLenFromPx(newPos.left, element.x, device)
        }
      }

      if (newPos.top) {
        if (coordinate === 'center') {
          element.y = this.setLenFromPx(newPos.top - device.height / 2, element.y, device)
        } else {
          element.y = this.setLenFromPx(newPos.top, element.y, device)
        }
      }

      if (newPos.width) {
        element.width = this.setLenFromPx(newPos.width, element.width, device)
      }

      if (newPos.height) {
        element.height = this.setLenFromPx(newPos.height, element.height, device)
      }
    },

    // 将以px为单位的长度转换回vw、 vh等长度格式
    setLenFromPx (newValue, originalValue, device) {
      let { unit } = utils.getLenSplits(originalValue)
      if (unit === 'vw') {
        return Math.floor(newValue / device.width * 100) + 'vw'
      } else if (unit === 'vh') {
        return Math.floor(newValue / device.height * 100) + 'vh'
      } else {
        return newValue
      }
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
