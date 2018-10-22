<template>
  <div class="designed-scene" ref="root" :style="sceneStyle">
    <div v-for="(element, index) in data.elements" :key="index" :style="getElementStyle(element)">
      <vue-anime-typing v-if="element.type==='typing'">{{element.text}}</vue-anime-typing>
      <vue-moving-image v-if="element.type==='image'" :url="element.url"></vue-moving-image>
      <vue-text-bubble v-if="element.type==='text-bubble'">{{element.text}}</vue-text-bubble>
    </div>
  </div>
</template>

<script>
import SceneMixins from './SceneMixins'
export default {
  name: 'DesignedScene',
  mixins: [SceneMixins],
  computed: {
    sceneStyle () {
      return {
        background: this.data.background
      }
    }
  },
  data () {
    return {
      grid: {
        width: 0,
        height: 0
      }
    }
  },
  mounted () {
    let gridConfig = this.$root.config.grid
    if (!gridConfig) {
      console.error('designed scene require grid config')
    }
    this.grid.width = window.outerWidth / gridConfig.x
    this.grid.height = window.outerHeight / gridConfig.y
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
      }
      if (element.clipPath) {
        style.clipPath = element.clipPath
      }
      return style
    }
  }
}
</script>

<style lang="less">
.designed-scene {
  height: 100%;
}
</style>
