<template>
<div class="scene" :style="sceneStyle">
  <div class="element-wrapper" v-for="(element, index) in sceneConfig.elements" :key="index">
    <img v-if="element.type==='image'" class="slide-image" :style="element.displayStyle"
           :src="element.src||''">
  </div>
</div>
</template>

<script>
import utils from '../utils/util'
export default {
  name: 'Scene',
  props: {
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

  computed: {
    sceneStyle () {
      return {
        width: this.device.width,
        height: this.device.height
      }
    },
    sceneConfig () {
      return utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate)
    }
  },

  data () {
    return {
    }
  },
  methods: {
    computeSceneStyle () {
      return utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate)
    }
  }
}
</script>

<style scoped>

</style>
