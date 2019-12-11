<template>
  <div :style="deviceStyle" class="device player"
    @click="onSceneClick">
    <div v-if="isLoading" class="loading boxLoading">
      <div v-for="(load, index) in imagePreloads" :key="index" class="image-preloads">
        <img :src="load.url" @load="imageLoaded(index)"/>
      </div>
    </div>
    <div class="play-interaction" v-if="!isLoading && !playConfirmed" @click="startEngine">
      <img v-if="imagePreloads.length" class="blur" :src="imagePreloads[0].url">
      <!--<work-cover :enable-mask="false" :work="work" :device-set="device"></work-cover>-->
      <div class="interaction-mask">
        <a class="button is-primary is-large">点击播放</a>
      </div>
    </div>
    <div v-if="playConfirmed && !playFinished">
      <div v-for="scene in work.scenes" :key="scene.id"
        :style="scene.style" class="scene">
        <render-element
          v-for="(element, index) in scene.elements"
          :element="element"
          :key="element.id"
          :index="index"/>
      </div>
    </div>
    <div class="play-finished" v-if="playFinished">
      <img v-if="imagePreloads.length" class="blur" :src="imagePreloads[imagePreloads.length - 1].url">
      <div class="interaction-mask">
        <div class="qrcode">
          <img src="./qrcode.png">
        </div>
        <a class="button is-primary is-medium" @click="startEngine">重新播放</a>
        <a class="button is-success is-medium" @click="$router.push('/slide/lite')">我也要制作</a>
      </div>
    </div>
  </div>
</template>

<script>
import { sceneTypeEnum } from '../danke-core/elements/scene'
import { getImageWebUrl } from '../danke-core/utils/styles'
import { TypeEnum } from '../danke-core/elements/index'
import DankeEngine from './engine'
import AudioDanke from '../danke-core/audio-engine'
import mixinDevice from './mixinDevice'
import RenderElement from '../xd-builder/RenderElement'
export default {
  name: 'Player',
  components: {
    RenderElement
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
      playFinished: false,
      TypeEnum,
      sceneTypeEnum
    }
  },

  mounted () {
    // 回写cssFrame
    for (let i = 0; i < this.work.scenes.length; i++) {
      const scene = this.work.scenes[i]
      for (let element of scene.elements) {
        if (element.animations && element.animations.length) {
          for (let animation of element.animations) {
            animation.cssFrame = this.work.frames[animation.name]
          }
        }
      }
    }
    this.imagePreloads = this.getWorkImagesInDevice(this.work, this.device)
    if (this.imagePreloads.length === 0) {
      this.isLoading = false
    }
  },

  methods: {
    async startEngine () {
      const _this = this
      this.playConfirmed = true
      this.playFinished = false
      this.engine = null
      if (this.work.audioUrl) {
        this.audio = new Audio('http://image.danke.fun/' + this.work.audioUrl)
        const playPromise = this.audio.play()
        if (playPromise !== undefined) {
          await playPromise
        }
        this.audio.onended = async function () {
          _this.playFinished = true
        }
      }
      this.engine = new DankeEngine(this.work, this.device)
      this.engine.play()
      this.engine.setDeviceEl(this.$el)
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
      img.blur {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(6px);
      }
      .interaction-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0, .2);
        z-index: 9999;
        color: #fff;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .play-finished {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      img.blur {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(6px);
      }
      .interaction-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0, .2);
        z-index: 9999;
        color: #fff;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .qrcode {
          width: 160px;
          height: 160px;
          padding: 10px;
          background-color: #fff;
        }
        .button {
          margin-top: 20px;
        }
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
      overflow: hidden;
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
