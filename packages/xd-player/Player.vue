<template>
<div class="device" :style="deviceStyle">
  <div class="loading"></div>
  <div v-for="scene in work.scenes" :key="scene.id" class="scene" :style="scene.style">
    <div v-for="(element, index) in scene.elements" :key="element.id" class="element"
      @click="onElementClicked(index)"
      :style="element.style"
      :class="[element.animationPreview, index===currentIndex?'current':'']">
      <img v-if="element.type === TypeEnum.IMAGE" :src="element.url">
      <span v-if="element.type === TypeEnum.TEXT" v-html="$options.filters.newline(element.text)"></span>
    </div>
  </div>
</div>
</template>

<script>
import { getElementStyle, getSceneStyle, renderSceneStage } from '../danke-core/utils/styles'
import { sceneTypeEnum } from '../danke-core/elements/scene'
import { TypeEnum } from '../danke-core/elements/index'
export default {
  name: 'Player',
  components: {
  },
  props: {
    work: {
      type: Object
    },
    device: {
      type: Object
    }
  },
  filters: {
    newline (v) {
      return v.replace(/\n/g, '<br>')
    }
  },
  watch: {},
  computed: {},
  created () {

  },
  async mounted () {
    await this.loadResources()

    const [width, height] = this.work.screen.split(':')
    this.device.width = this.$el.clientWidth
    this.device.height = Math.floor(this.device.width * parseInt(height) / parseInt(width))
    this.sceneStyle = getSceneStyle(this.scene, this.device)
    this.renderStage()
  },
  data () {
    return {
      TypeEnum,
      sceneTypeEnum,
      currentSceneIndex: -1,
      backgroundSceneIndex: -1,
      forgroundSceneIndex: -1,
    }
  },
  methods: {
    async loadResources () {
      
    },
    async renderNextScene () {
      let nextSceneIndex = this.currentSceneIndex + 1
      while (this.work.scenes[nextSceneIndex] && this.work.scenes[nextSceneIndex].type !== 1 ) {
        if (this.work.scenes[nextSceneIndex].type === sceneTypeEnum.BACKGROUND) {
          if (this.backgroundSceneIndex > -1) {
            this.renderSceneStage(this.backgroundSceneIndex, 'out')
          }
          this.backgroundSceneIndex = nextSceneIndex
          this.renderSceneStage(this.backgroundSceneIndex, 'in')
        } else if (this.work.scenes[nextSceneIndex].type === sceneTypeEnum.FORGROUND) {
          if (this.forgroundSceneIndex > -1) {
            this.renderSceneStage(this.forgroundSceneIndex, 'out')
          }
          this.forgroundSceneIndex = nextSceneIndex
          this.renderSceneStage(this.forgroundSceneIndex, 'in')
        }
        nextSceneIndex ++
      }
      if (this.work.scenes[nextSceneIndex]) {
        this.renderSceneStage(this.currentSceneIndex, 'out')
        this.currentSceneIndex = nextSceneIndex
        await this.renderSceneStage(this.currentSceneIndex, 'in')
        await this.renderSceneStage(this.currentSceneIndex, 'dura')
        await this.renderNextScene()
      }
    },
    renderSceneStage (sceneIndex, stage) {
      const scene = this.work.scenes[sceneIndex]
      if (scene) {
        this.work.scenes[sceneIndex].style = getSceneStyle(this.work.scenes[sceneIndex], this.device, stage)
        for (let element of this.scene.elements) {
          if (element.type === TypeEnum.IMAGE) {
            let w = getLength(element.size.width, this.device)
            let h = getLength(element.size.height, this.device)
            element.baseUrl = element.baseUrl || element.url
            if (element.baseUrl) {
              element.url = 'http://image.danke.fun' + element.baseUrl.replace(/http[s]*:\/\/[^/]+/g, '') + '?x-oss-process=image/format,webp/quality,Q_80/resize,m_fixed,h_' + h + ',w_' + w
            }
          }
          element.style = getElementStyle(element, this.device, stage)
        }
      }
    },

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
    renderElement (element) {
      this.$set(element, 'computedStyle', getElementStyle(element, this.device))
      // element.computedStyle = styleUtils.getElementStyle(element, this.device)
    },
    onElementClicked (index) {
      this.currentIndex = index
      this.currentElement = this.scene.elements[index]
      this.$emit('element-selected', index)
    }
  }
}
</script>

<style lang="less">
#player-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
