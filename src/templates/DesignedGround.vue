<template>
  <div class="designed-ground" ref="root" :style="sceneStyle">
    <div v-for="(element, index) in elements" :key="index" :style="getElementStyle(element)">
      <vue-anime tag="div" :ref="'element' + index" :easing="element.easing || 'linear'">
        <vue-moving-image v-if="element.type==='image'" :url="element.url"></vue-moving-image>
      </vue-anime>
    </div>
  </div>
</template>

<script>
import VueMovingImage from 'vue-moving-image/src/components/MovingImage'
import SizingMixin from './ElementSizingMixin'
import { VueAnime } from 'vue-anime'
export default {
  name: 'DesignedGround',
  mixins: [SizingMixin],
  components: {
    VueMovingImage,
    VueAnime
  },
  props: {
    state: {
      type: String
    },
    data: {
      type: Object
    }
  },
  methods: {
    getElementStyle (element) {
      const style = {
        position: 'absolute',
        left: element.left * this.grid.width + 'px',
        top: element.top * this.grid.height + 'px',
        width: element.width * this.grid.width + 'px'
      }
      if (element.shape === 'circle' || element.shape === 'square') {
        style.height = style.width
      } else if (element.height) {
        style.height = element.height * this.grid.height + 'px'
        console.log('set style height', element, style.height)
      }
      /* if (element.clipPath) {
        style.clipPath = element.clipPath
      } */
      return style
    }
  }
}
</script>

<style scoped>

</style>
