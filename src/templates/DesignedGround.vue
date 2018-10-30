<template>
  <div class="designed-ground" ref="root">
    <div v-for="(element, index) in elements" :key="index" :style="getElementSizingStyle(element)">
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

  }
}
</script>

<style scoped>

</style>
