<template>
<div class="device player" :style="deviceStyle">
  <div class="loading"></div>
  <div v-for="scene in work.scenes" :key="scene.id" class="scene" :style="scene.style">
    <div v-for="(element) in scene.elements" :key="element.id" class="element"
      :style="element.style">
      <img v-if="element.type === TypeEnum.IMAGE" :src="element.url">
      <span v-if="element.type === TypeEnum.TEXT" v-html="$options.filters.newline(element.text)"></span>
    </div>
  </div>
</div>
</template>

<script>
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
    onElementClicked (index) {
      this.currentIndex = index
      this.currentElement = this.scene.elements[index]
      this.$emit('element-selected', index)
    }
  }
}
</script>

<style lang="less">
.device.player {
  position: relative;
  overflow: hidden;
  .scene {
    position: absolute;
    left: 0;
    top: 0;
  }
  .element {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
