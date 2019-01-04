<template>
<div class="scene" :style="sceneStyle">
  <div v-for="(element, index) in sceneConfig.elements" :key="index" class="element-wrapper"  :class="[currentIndex===index?'selected':'', element.animationPreview]">
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
  </div>
</div>
</template>

<script>
import '../animations/entrance.css'
import '../animations/exits.css'
import utils from '../utils/util'

export default {
  name: 'SceneThumbnail',
  components: {
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

  created () {

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
      // this.$emit('element-selected', index)
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
