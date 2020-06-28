<template>
  <div id="capture-preview">
    <div class="preview-container">
      <div v-if="work && viewPort" class="device" :style="deviceStyle" @click="refreshWork">
        <render-scene v-if="currentScene" :scene="currentScene" stage="enter" :work="work" :view-port="viewPort" :view-box="work.viewBox" />
        <render-scene v-if="lastScene" :scene="lastScene" stage="exist" :work="work" :view-port="viewPort" :view-box="work.viewBox" />
      </div>
    </div>
    <i v-if="nextScene" class="el-icon-right abs-actions" @click="enterScene(nextScene)" />
    <i v-if="prevScene" class="el-icon-back abs-actions" @click="enterScene(prevScene)" />
    <div v-show="!isFullScreen" class="action-bar">
      <div class="action-button" @click="refreshWork">
        <i class="el-icon-refresh-right" />
      </div>
      <div class="action-button" @click="enterFullScreen">
        <i class="el-icon-full-screen" />
      </div>
      <div class="action-button" @click="likeWork">
        <i class="el-icon-star-off" />
      </div>
    </div>
  </div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry.js'
import { fitRectIntoBounds } from '../mixins/rectUtils.js'
import workMixin from '../work/workMixin.js'
import sceneMixin from '../mixins/sceneMixins.js'
import RenderScene from '../render/RenderScene'
import RestDAO from '../../common/dao/restdao'
export default {
  name: 'CapturePreview',
  components: {
    RenderScene,
  },
  mixins: [ workMixin, sceneMixin ],
  data () {
    return {
      isFullScreen: false,
      nextScene: null,
      currentScene: null,
      prevScene: null,
      viewPort: null,
      work: null
    }
  },
  computed: {
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
  },
  methods: {
    async loadAndInitDevice (workId) {
      // 加载作品
      await this.loadWork(workId)
      // 设置显示屏幕大小
      window.resizeTo(this.work.viewBox.width, this.work.viewBox.height)
      this.viewPort = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      }
      this.enterScene(0)
    },

    async enterScene (scene) {
      let index = scene
      if (typeof scene !== 'number') {
        index = this.work.scenes.indexOf(scene)
      }
      this.currentScene = this.work.scenes[index]
      if (this.work.scenes.length - 1 > index) {
        this.nextScene = this.work.scenes[index + 1]
      } else {
        this.nextScene = null
      }
      if (index > 0) {
        this.prevScene = this.work.scenes[index - 1]
      } else {
        this.prevScene = null
      }
    },

    refreshWork () {
      this.currentScene = null
      setTimeout(() => {
        this.enterScene(0)
      }, 100)
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
#capture-preview {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
