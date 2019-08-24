<template>
  <div :style="deviceStyle" class="device player"
    @click="onSceneClick">
    <div v-if="isLoading" class="loading">
      <span>加载中</span>
      <div v-for="(load, index) in imagePreloads" :key="index" class="image-preloads">
        <img :src="load.url" @load="imageLoaded(index)"/>
      </div>
    </div>
    <div v-if="isLoading===false">
      <div v-for="scene in work.scenes" :key="scene.id"
        :style="scene.style" class="scene">
        <div v-for="(element) in scene.elements" :key="element.id"
          :class="['type' + element.type]"
          :style="element.style" class="element">
          <img v-if="element.url" :src="element.url">
          <span v-if="element.type === TypeEnum.TEXT" v-html="$options.filters.newline(element.text)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sceneTypeEnum } from '../danke-core/elements/scene'
import { getImageWebUrl } from '../danke-core/utils/styles'
import { TypeEnum } from '../danke-core/elements/index'
import DankeEngine from '../danke-core/engine'
import WorkCover from '../xd-builder/components/WorkCover'
export default {
  name: 'Player',
  components: {
    WorkCover
  },
  filters: {
    newline (v) {
      return v.replace(/\n/g, '<br>')
    }
  },
  props: {
    work: {
      type: Object
    },
    device: {
      type: Object
    }
  },
  data () {
    return {
      imagePreloads: this.getWorkImagesInDevice(this.work, this.device, this.ctx.supportWebp),
      isLoading: true,
      TypeEnum,
      sceneTypeEnum
    }
  },
  computed: {
    deviceStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },
  watch: {
  },
  created () {
  },
  async mounted () {

  },
  methods: {
    async startEngine () {
      this.engine = new DankeEngine(this.work.scenes, this.device)
      this.engine.play()
      this.engine.setDeviceEl(this.$el)
    },
    async loadResources () {
      return new Promise((resolve, reject) => {
        const loader = new Loader()
        for (let scene of this.work.scenes) {
          for (let element of scene.elements) {
            if (element.url) {
              loader.add(element.id, getImageWebUrl(element, this.device, this.ctx.supportWebp))
            }
          }
        }
        loader.load(() => {
          resolve()
        })
        loader.onProgress.add(() => {})
        loader.onComplete.add(() => {})
      })
    },

    imageLoaded (index) {
      this.imagePreloads[index].loaded = true
      for (let load of this.imagePreloads) {
        if (!load.loaded) return
      }
      this.isLoading = false
      this.startEngine()
    },

    getWorkImagesInDevice (work, device, iswep) {
      const result = []
      for (let scene of this.work.scenes) {
        for (let element of scene.elements) {
          if (element.url) {
            result.push({
              id: element.id,
              url: getImageWebUrl(element, device, iswep),
              loaded: false
            })
          }
        }
      }
      return result
    },

    onSceneClick () {
      // if (this.engine.displays.current.manual) {
      //   this.engine.next()
      // }
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
  .image-preloads {
    opacity: 0;
  }
  .scene {
    position: absolute;
    left: 0;
    top: 0;
  }
  .element {
    position: absolute;
    &.type1 {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.type2 {
      display: flex;
      align-items: center;
      span {
        width: 100%;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
