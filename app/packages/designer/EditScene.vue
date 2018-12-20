<template>
<div class="scene" :style="sceneStyle">
  <vue-draggable-resizable v-for="(element, index) in sceneConfig.elements" :key="index" class="element-wrapper"
    @activated="onElementClicked(index)"
    @deactivated="onSceneClicked"
    :class="[element.animationPreview]">
    <van-icon v-if="currentIndex===index" name="setting-o" @click.stop="onConfigElement(currentElement)"></van-icon>
    <div v-if="element.type==='image'" class="image" :style="{
      backgroundImage: element.src
    }">
    </div>
    <div v-if="element.type === 'text'" class="text" :style="{
      fontSize: element.font
    }">
      {{element.content}}
    </div>
    <div v-if="element.type === 'circle'" class="circle">
    </div>
  </vue-draggable-resizable>

  <vue-draggable-resizable :x="5" :y="device.height - 480" w="320" h="260" v-if="showElementEditBox">
    <edit-element></edit-element>
  </vue-draggable-resizable>
</div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import EditElement from './ElementEdit'
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
    scene () {
      // this.sceneConfig = utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate, this.styleName)
    }
  },
  computed: {
    sceneStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    },
    sceneConfig () {
      const sceneConfig = utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate, this.styleName)
      return sceneConfig
    }
  },

  created () {
    // this.sceneConfig = utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate, this.styleName)
  },

  data () {
    return {
      showElementEditBox: false,
      currentElement: null,
      currentIndex: -1
    }
  },
  methods: {
    computeSceneStyle () {
      return utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate)
    },

    onConfigElement () {

    },
    onElementClicked (index) {
      this.currentIndex = index
      this.$emit('element-selected', index)
      this.currentElement = this.scene.elements[index]
    },
    onSceneClicked () {
      this.currentIndex = -1
      this.currentElement = null
      this.$emit('scene-selected')
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
