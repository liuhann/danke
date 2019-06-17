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
import { createSheet, addAnimationStyle } from '../frames/keyframe'
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
    this.renderStage('in')
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
    renderStage (stage) {
      for (let element of this.scene.elements) {
        let w = getLength(element.size.width, this.device)
        let h = getLength(element.size.height, this.device)
        element.baseUrl = element.baseUrl || element.url
        if (element.baseUrl) {
          element.url = 'http://image.danke.fun' + element.baseUrl.replace(/http[s]*:\/\/[^/]+/g, '') + '?x-oss-process=image/format,webp/quality,Q_80/resize,m_fixed,h_' + h + ',w_' + w
        }
        element.style = getElementStyle(element, this.device, stage)
      }
    },
    replay () {
      const elements = this.scene.elements
      this.scene.elements = []
      setTimeout( ()=> {
        this.scene.elements = elements
        this.renderStage('in')
      }, 300)
    },
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
