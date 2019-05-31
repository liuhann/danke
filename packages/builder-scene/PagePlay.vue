<template>
<div class="scene" :style="sceneStyle">
  <div v-for="element of scene.elements" :key="element.id"
       class="element" :style="element.style"
       @click.self="elementClick(element)">
    <span v-if="element.type === TypeEnum.TEXT" v-html="$options.filters.newline(element.text)"></span>
  </div>
</div>
</template>

<script>
import { getElementStyle, getSceneStyle, getLength } from '../danke-core/utils/styles'
import ELEMENT_TPL, { simplify, TypeEnum } from '../danke-core/css-model/element'
import { createSheet, addAnimationStyle } from '../builder-frame/keyframe'
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
  filters: {
    newline (v) {
      return v.replace(/\n/g, '<br>')
    }
  },
  created () {
    for (let element of this.scene.elements) {
      let w = getLength(element.size.width, this.device)
      let h = getLength(element.size.height, this.device)
      if (element.url) {
        element.url = 'http://image.danke.fun' + element.url.replace(/http[s]*:\/\/[^/]+/g, '') + '?x-oss-process=image/format,jpg/quality,Q_80/resize,m_fixed,h_' + h + ',w_' + w
      }
      element.style = getElementStyle(element, this.device, 'in')
    }
  },
  data () {
    return {
      TypeEnum
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
.scene {
	position: relative;
  font-size: 12px;
}
</style>
