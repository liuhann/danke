<template>
  <div class="page-slide-preview" :style="workStyle">
    <div v-if="work && viewPort" class="preview-container">
      <div class="device" :style="deviceStyle">
        <render-scene v-show="!playing" :scene="work.scenes[0]" stage="enter" :view-port="viewPort" :view-box="work.viewBox" />
        <render-scene v-for="(scene, index) in work.scenes" v-show="scene.visible" :key="index" :scene="scene" :stage="scene.stage" :view-port="viewPort" :view-box="work.viewBox" />
      </div>
    </div>
    <div v-if="work && viewPort" class="action" :style="actionStyle">
      <i v-if="currentSceneIndex > 0 && !currentAutoPlay" class="el-icon-right next-scene" @click="enterScene(currentSceneIndex + 1)" />
      <i v-if="(currentSceneIndex < work.scenes.length - 1) && !currentAutoPlay" class="el-icon-back prev-scene" @click="enterScene(currentSceneIndex - 1)" />
      <i class="el-icon-video-play play" @click="play" />
    </div>
    <div class="seconds">
      {{ currentSecondsFormated }}
    </div>
  </div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry.js'
import { fitRectIntoBounds } from '../mixins/rectUtils.js'
import workMixin from '../work/workMixin.js'
import sceneMixin from '../mixins/sceneMixins.js'
import RenderScene from '../render/RenderScene'
import RestDAO from '../../utils/restdao.js'
export default {
  name: 'Preview',
  components: {
    RenderScene,
  },
  mixins: [ workMixin, sceneMixin ],
  data () {
    return {
      playing: false,
      playend: false,
      currentSceneIndex: 0,
      currentSeconds: 0,
      viewPort: null,
      work: null
    }
  },
  computed: {

    currentSecondsFormated() {
      return new Date(this.currentSeconds).toISOString().replace(/.*(\d{2}:\d{2}.\d{2}).*/, "$1");
    },

    currentAutoPlay () {
      if (this.work) {
        return this.work.scenes[this.currentSceneIndex].duration > 0
      } else {
        return false
      }
    },
    workStyle () {
      if (this.work) {
        return {
          background: this.work.color
        }
      } else {
        return  {}
      }
    },

    actionStyle () {
      if (!this.playing) {
        return {
          opacity: .3
        }
      } else {
        return {
          opacity: 0
        }
      }
    },
    deviceStyle () {
      if (this.viewPort) {
        return {
          background: this.work.color,
          perspective: this.viewPort.width + 'px',
          width: this.viewPort.width + 'px',
          height: this.viewPort.height + 'px'
        }
      } else {
        return {
          width: '640px',
          height: '320px'
        }
      }
    }
  },
  created () {
    this.likedao = new RestDAO(this.ctx, 'danke/like')
    this.ctx.styleRegistry = new StyleRegistry()
  },
  mounted () {
    let workId = this.$route.query.work || this.$route.params.work
    this.loadAndInitDevice(workId)

    window.addEventListener(
      "resize", () => {
        let padding = 48
        if (document.fullscreenElement) {
          padding = 0
          this.isFullScreen = true
          this.currentScene = null
          setTimeout(() => {
            this.enterScene(0)
          }, 100)
        } else {
          this.isFullScreen = false
        }
        // 设置显示屏幕大小
        this.viewPort = fitRectIntoBounds(this.work.viewBox, {
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight
        })
      },false
    );
  },
  methods: {
    async loadAndInitDevice (workId) {
      // 加载作品
      await this.loadWork(workId)
      // 设置显示屏幕大小
      this.viewPort = fitRectIntoBounds(this.work.viewBox, {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      })
      if (this.work.audioUrl) {
        this.audioInstance = new Audio(this.work.audioUrl)
        this.audioInstance.loop = true
        this.audioInstance.onloadedmetadata = () => {
        }
        this.audioInstance.onended = () => {

        }
        this.audioInstance.load()
      } else {
      }
    },

    play () {
      this.currentSeconds = 0
      const startMinuts = new Date().getTime()

      this.updInterval = setInterval(() => {
        this.currentSeconds = new Date().getTime() - startMinuts
      }, 20)
      this.currentSceneIndex = 0
      this.enterScene(0)
      if (this.audioInstance)
        this.playing = true
        this.audioInstance.currentTime = 0
        this.audioInstance.play()
    },
    
    async enterScene (index) {
      this.work.scenes[index].visible = true
      this.work.scenes[index].stage = 'enter'
      console.log(this.currentSecondsFormated)
      if (this.currentAutoPlay) {
        this.nextInteval = setTimeout(() => {
          if (this.currentSceneIndex < this.work.scenes.length - 1) {
            this.currentSceneIndex ++
            this.enterScene(this.currentSceneIndex)
            this.leaveScene(this.currentSceneIndex - 1)
          } else {
            this.audioInstance.pause()
            this.playing = false
            this.playend = true
          }
        }, this.work.scenes[index].duration * 1000)
      }
    },

    async leaveScene (index) {
      if (this.work.scenes[index].renderExit) {
        this.work.scenes[index].stage = 'exist'
      }
      setTimeout(() => {
        this.work.scenes[index].visible = false
      }, this.work.scenes[index].exit * 1000)
    },

    refreshWork () {
      this.currentSceneIndex = 0
      this.enterScene(this.currentSceneIndex)
    },

    likeWork () {

    },

    enterFullScreen () {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          this.isFullScreeen = true
        })
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
          this.isFullScreeen = false
        }
      }
    }
  }
}
</script>

<style lang="scss">

.page-slide-preview {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .seconds {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #000;
    color: #fff;
  }
  .preview-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .abs-actions {
    position: absolute;
    font-size: 3rem;
    cursor: pointer;
    &:hover {
      color: #00bf72;
    }
    &.el-icon-right {
      right: 24px;
      top: calc(50vh - 20px);
    }
    &.el-icon-back {
      left: 24px;
      top: calc(50vh - 20px);
    }
  }

  .action {
    position: absolute;
    background-color: #000;
    transition: opacity .6s linear;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    .play, .replay {
      transition: transform .3s linear;
      cursor: pointer;
      font-size: 10vh;
      color: #fff;
      position: absolute;
      left: calc(100% / 2 - 5vh);
      top: calc(100% / 2 - 5vh);
      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .action-bar {
    border-top: 1px solid #efefef;
    font-size: 2rem;
    height: 48px;
    line-height: 48px;
    display: flex;
    justify-content: center;
    .action-button {
      cursor: pointer;
      margin: 0 10px;
      width: 48px;
      text-align: center;
      &:hover {
        background: #ccc;
      }
    }
  }
}
.device {
  background: #fff;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 0 0 1px rgba(14,19,24,.02), 0 2px 8px rgba(14,19,24,.15);
  border-radius: 4px;
  position: relative;
  margin-bottom: 20px;
  .scene {
    width: 100%;
    height: 100%;
    position: absolute;
    .element {
      position: absolute;
    }
  }
}
</style>
