<template>
<div class="scene" :style="sceneStyle">
  <div class="element-wrapper" :class="[currentIndex===index?'selected':'']" v-for="(element, index) in sceneConfig.elements" :key="index" :style="element.displayStyle" v-tap.stop="checkThis.bind(null, index)">
    <div v-if="element.type==='image'" class="slide-image" :style="{
      backgroundImage: element.src
    }">
    </div>
  </div>
</div>
</template>

<script>
import utils from '../utils/util'
export default {
  name: 'Scene',
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
    }
  },

  watch: {
    scene () {
      debugger
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
      return utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate)
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

    checkThis (index) {
      this.currentIndex = index
      this.$emit('element-selected', index)
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
    .slide-image {
      width: 100%;
      height: 100%;
      background-color: #E4E4E4;
    }
  }
}
</style>
