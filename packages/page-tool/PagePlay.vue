<template>
<div class="scene" :style="sceneStyle">
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
    device: {
      type: Object
    },
    scene: {
      type: Object
    }
  },
  created () {

  },
  computed: {
    sceneStyle () {
      debugger;
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
