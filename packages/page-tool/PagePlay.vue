<template>
<div class="scene" :style="sceneStyle">
  <div v-for="element of scene.elements" :key="element.id"
       class="element" :style="element.style"
       @click.self="elementClick(element)">{{element.text}}</div>
</div>
</template>

<script>
  import { getElementStyle, getSceneStyle, getLength } from '../danke-core/utils/styles'

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
    for (let element of this.scene.elements) {
      let w = getLength(element.size.width, this.device)
      let h = getLength(element.size.height, this.device)
      element.url = 'http://image.danke.fun' + element.url.replace(/http[s]*:\/\/[^/]+/g, '') + '?x-oss-process=image/resize,m_fixed,h_' + h + ',w_' + w
      element.style = getElementStyle(element, this.device)
    }
  },
  computed: {
    sceneStyle () {
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
