<template>
  <div class="designed-scene" ref="root" :style="sceneStyle">
    <div v-for="(element, index) in elements" :key="index" :style="getElementStyle(element)">
      <vue-anime tag="div" :ref="'element' + index" easing="linear">
        <vue-anime-typing v-if="element.type==='typing' && element.mount">{{element.text}}</vue-anime-typing>
        <vue-moving-image v-if="element.type==='image' && element.mount" :url="element.url"></vue-moving-image>
        <vue-text-bubble v-if="element.type==='text-bubble' && element.mount" :position="element.position">{{element.text}}</vue-text-bubble>
      </vue-anime>
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
      elements: [],
      grid: {
        width: 0,
        height: 0
      }
    }
  },

  created () {
    this.elements = this.data.elements

    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i]
      element.index = i
      if (element.delay) {
        element.mount = false
        setTimeout(() => {
          element.mount = true
          this.$set(this.elements, element.index, element)
        }, element.delay)
      } else {
        element.mount = true
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
    this.setElementAnimeIn()
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
      /* if (element.clipPath) {
        style.clipPath = element.clipPath
      } */
      return style
    },

    setElementAnimeIn () {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].anime) {
          const ref = this.$refs['element' + i][0]
          Object.assign(ref.$el.style, this.elements[i].anime.from)
          ref.animate = this.elements[i].anime.to
        }
      }
    },

    setElementAnimeOut () {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].anime) {
          const ref = this.$refs['element' + i][0]
          Object.assign(ref.$el.style, this.elements[i].anime.to)
          ref.animate = this.elements[i].anime.leave
        }
      }
    },
    onLeave (data) {
      console.log('scene leave')
      this.setElementAnimeOut()
    }
  }

}
</script>

<style lang="less">
.designed-scene {
  height: 100%;
}
</style>
