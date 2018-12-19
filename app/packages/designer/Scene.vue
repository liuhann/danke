<template>
<div class="scene" :style="sceneStyle">
  <vue-draggable-resizable v-for="(element, index) in sceneConfig.elements" :key="index" class="element-wrapper"  :class="[currentIndex===index?'selected':'', element.animationPreview]" 
    :y="element.dnd.y"
    :x="element.dnd.x"
    :w="element.dnd.w"
    :h="element.dnd.h"
  >
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
  <!-- <div class="element-wrapper" v-for="(element, index) in sceneConfig.elements" :key="index"
       @click="onElementClicked(index)"
       :class="[currentIndex===index?'selected':'', element.animationPreview]" :style="element.displayStyle">
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
  </div> -->
</div>
</template>

<script>
  import VueDraggableResizable from 'vue-draggable-resizable'
import '../animations/entrance.css'
import '../animations/exits.css'
import utils from '../utils/util'

export default {
  name: 'Scene',
  components: {
    VueDraggableResizable
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
    scene () {}
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

  data () {
    return {
      currentElement: null,
      currentIndex: -1
    }
  },
  methods: {
    computeSceneStyle () {
      return utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate)
    },
    onElementClicked (index) {
      this.currentIndex = index
      this.$emit('element-selected', index)
      this.currentElement = this.scene.elements[index]
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
