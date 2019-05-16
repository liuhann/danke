<template>
<div class="page scene device" :style="sceneStyle">
  <div v-for="element of scene.elements" :key="element.id"
       class="element" :style="element.style"
       @click.self="elementClick(element)">{{element.text}}</div>
</div>
</template>

<script>
import { getElementStyle, getPositionSizingStyle, getLength, getSceneStyle } from '../danke-core/utils/styles'

export default {
  name: 'PagePlay',
  props: {
    scene: {
      type: Object
    }
  },
  computed: {
    deviceStyle () {
      return getSceneStyle(this.scene, this.device)
    }
  },
  methods: {
    elementClick (element) {
      this.$emit('element-click', element)
    }
  }
}
</script>

<style lang="scss">

</style>
