<template>
<div class="device" :style="deviceStyle">
  <div class="loading"></div>
  <div v-for="scene in work.scenes" :key="scene.id" class="scene" :style="scene.style">
    <div v-for="(element, index) in scene.elements" :key="element.id" class="element"
      @click="onElementClicked(index)"
      :style="element.style">
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
import DankeEngine from '../danke-core/engine'
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
  computed: {
    deviceStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },
  created () {

  },
  async mounted () {
    this.engine = new DankeEngine(this.work.scenes, this.device)
    this.engine.play()
    await this.loadResources()
  },
  data () {
    return {
      TypeEnum,
      sceneTypeEnum,
      currentSceneIndex: -1,
      backgroundSceneIndex: -1,
      forgroundSceneIndex: -1
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
        nextSceneIndex++
      }
      if (this.work.scenes[nextSceneIndex]) {
        this.renderSceneStage(this.currentSceneIndex, 'out')
        this.currentSceneIndex = nextSceneIndex
        await this.renderSceneStage(this.currentSceneIndex, 'in')
        await this.renderSceneStage(this.currentSceneIndex, 'dura')
        await this.renderNextScene()
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
.device {
  position: relative;
  overflow: hidden;
}
</style>
