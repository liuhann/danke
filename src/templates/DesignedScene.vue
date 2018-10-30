<template>
  <div class="designed-scene" ref="root" :style="sceneStyle">
    <div v-for="(element, index) in elements" :key="index">
      <vue-anime tag="div" v-if="element.mount" :ref="'element' + index" :easing="element.anime && element.anime.easing" :style="getPositionSizing(element)">
        <vue-anime-typing v-if="element.type==='typing'"
            :group-style="fontGroupStyle(element)"
            :duration="element.duration"
            :easing="element.easing"
            :animation-in="element.animationIn"
            :delay="element.delay">{{element.text}}</vue-anime-typing>
        <vue-moving-image v-if="element.type==='image'" :url="element.url" :duration="element.duration"></vue-moving-image>
        <vue-text-bubble v-if="element.type==='text-bubble'" :position="element.position">{{element.text}}</vue-text-bubble>
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
      elements: []
    }
  },

  created () {
    this.elements = this.data.elements
    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i]
      element.index = i
    }
    this.scheduleElementMount()
  },

  mounted () {
    this.setElementAnimeIn(this.elements)
  },

  methods: {
    getPositionSizing (element) {
      const style = {
        position: 'absolute',
        left: element.left * this.gridWidth + 'px',
        top: element.top * this.gridWidth + 'px'
      }
      if (element.width) {
        style.width = element.width * this.gridWidth + 'px'
      }
      if (element.shape === 'circle' || element.shape === 'square') {
        style.height = style.width
      } else if (element.height) {
        style.height = element.height * this.gridHeight + 'px'
      }
      /* if (element.clipPath) {
        style.clipPath = element.clipPath
      } */
      return style
    },

    /**
     * schedule for delayed animate elements
     */
    scheduleElementMount () {
      for (let i = 0; i < this.elements.length; i++) {
        const element = this.elements[i]
        if (element.delay) {
          element.mount = false
          this.ticker.addTick(() => {
            element.mount = true
            this.$set(this.elements, element.index, element)
            this.$nextTick(() => {
              this.setElementAnimeIn([element])
            })
          }, element.delay)
        } else {
          element.mount = true
        }
      }
    },

    setElementAnimeIn (elements) {
      for (let element of elements) {
        if (element.anime) {
          const ref = this.$refs['element' + element.index][0]
          if (ref) {
            Object.assign(ref.$el.style, element.anime.from)
            ref.animate = element.anime.to
          }
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
