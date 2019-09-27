<template>
  <div :style="deviceStyle" class="device player"
    @click="onSceneClick">
    <div v-if="isLoading" class="loading boxLoading">
      <div v-for="(load, index) in imagePreloads" :key="index" class="image-preloads">
        <img :src="load.url" @load="imageLoaded(index)"/>
      </div>
    </div>
    <div class="play-interaction" v-if="!isLoading && !playConfirmed" @click="startEngine">
      <work-cover :enable-mask="false" :work="work" :device-set="device"></work-cover>
      <div class="interaction-mask">
        <div class="text">点击播放</div>
      </div>
    </div>
    <div v-if="playConfirmed">
      <div v-for="scene in work.scenes" :key="scene.id"
        :style="scene.style" class="scene">
        <div v-for="(element) in scene.elements" :key="element.id"
          :class="['type' + element.type]"
          :style="element.style" class="element">
          <img v-if="element.url" :src="element.url" :style="element.innerStyle||''">
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
import AudioDanke from '../danke-core/audio-engine'
import mixinDevice from './mixinDevice'
import sleep from '../common/utils/sleep'
import WorkCover from '../xd-builder/components/WorkCover'
export default {
  name: 'Player',
  components: {
    WorkCover
  },
  mixins: [ mixinDevice ],
  filters: {
    newline (v) {
      return v.replace(/\n/g, '<br>')
    }
  },
  props: {
    isAudio: {
      type: Boolean,
      default: false
    },
    work: {
      type: Object
    }
  },
  data () {
    return {
      imagePreloads: [],
      isLoading: true,
      playConfirmed: false,
      TypeEnum,
      sceneTypeEnum
    }
  },

  mounted () {
    this.imagePreloads = this.getWorkImagesInDevice(this.work, this.device)
    if (this.imagePreloads.length === 0) {
      this.isLoading = false
    }
  },

  methods: {
    async startEngine () {
      const _this = this
      this.playConfirmed = true
      this.engine = null
      if (this.work.audioUrl) {
        this.audio = new Audio('http://image.danke.fun/' + this.work.audioUrl)
        const playPromise = this.audio.play()
        if (playPromise !== undefined) {
          await playPromise
        }
        // this.audio.onended = async function () {
        //   await sleep(500)
        //   _this.startEngine()
        // }
        this.engine = new AudioDanke(this.work, this.device, this.audio)
        this.engine.play()
      } else {
        this.engine = new DankeEngine(this.work.scenes, this.device)
        this.engine.play()
        this.engine.setDeviceEl(this.$el)
      }
    },

    imageLoaded (index) {
      this.imagePreloads[index].loaded = true
      for (let load of this.imagePreloads) {
        if (!load.loaded) return
      }
      this.isLoading = false
    },

    async loadAudio (url) {
      const audio = new Audio(url)
      return new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => {
          debugger
          resolve()
        }, false)
      })
    },
    async xhrLoad (url) {
      const request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.responseType = 'blob'
      return new Promise((resolve, reject) => {
        request.onload = function () {
          if (this.status === 200) {
            resolve()
          }
        }
        request.send()
      })
    },

    getWorkImagesInDevice (work, device) {
      const result = []
      for (let scene of this.work.scenes) {
        for (let element of scene.elements) {
          if (element.url) {
            result.push({
              id: element.id,
              url: getImageWebUrl(element, device),
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
  background: #fff;

  .play-interaction {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .interaction-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0, .7);
      z-index: 9999;
      color: #fff;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
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

.boxLoading {
  width: 50px;
  height: 50px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0; }
.boxLoading:before {
  content: '';
  width: 50px;
  height: 5px;
  background: #000;
  opacity: 0.1;
  position: absolute;
  top: 59px;
  left: 0;
  border-radius: 50%;
  animation: shadow .5s linear infinite; }
.boxLoading:after {
  content: '';
  width: 50px;
  height: 50px;
  background: #ff9d29;
  animation: animate .5s linear infinite;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px; }

.boxLoading-dark:after {
  background: #74b1e4; }

@keyframes animate {
  17% {
    border-bottom-right-radius: 3px; }
  25% {
    transform: translateY(9px) rotate(22.5deg); }
  50% {
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 40px; }
  75% {
    transform: translateY(9px) rotate(67.5deg); }
  100% {
    transform: translateY(0) rotate(90deg); } }

@keyframes shadow {
  0%, 100% {
    transform: scale(1, 1); }
  50% {
    transform: scale(1.2, 1); } }
</style>
