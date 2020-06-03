<template>
<div class="page-slide-preview">
  <div class="preview-container">
    <div class="device" v-if="work && viewPort" :style="deviceStyle">
      <render-scene v-for="(scene, index) in work.scenes" :key="index" v-show="scene.visible" :scene="scene" :stage="scene.stage" :view-port="viewPort" :view-box="work.viewBox"/>
    </div>
  </div>
  <template v-if="work">
    <i class="el-icon-right abs-actions" v-if="currentSceneIndex > 0" @click="enterScene(currentSceneIndex - 1)"></i>
    <i class="el-icon-back abs-actions" v-if="(currentSceneIndex < work.scenes.length - 1) && !currentAutoPlay" @click="enterScene(currentSceneIndex + 1)"></i>
  </template>
  <div class="action-bar" v-show="!isFullScreen">
    <div class="action-button" @click="refreshWork"><i class="el-icon-refresh-right" /></div>
    <div class="action-button" @click="enterFullScreen"><i class="el-icon-full-screen" /></div>
    <div class="action-button" @click="likeWork"><i class="el-icon-star-off" /></div>
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
  name: 'Preview',
  mixins: [ workMixin, sceneMixin ],
  components: {
    RenderScene,
  },
  data () {
    return {
      isFullScreen: false,
      currentSceneIndex: 0,
      viewPort: null,
      work: null,
      autoPlay: false
    }
  },
  created () {
    this.likedao = new RestDAO(this.ctx, 'danke/like')
    this.ctx.styleRegistry = new StyleRegistry()
  },
  computed: {
    currentAutoPlay () {
      if (this.work) {
        return this.work.scenes[this.currentSceneIndex].duration > 0
      } else {
        return false
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
          width: this.$el.offsetWidth - padding,
          height: this.$el.offsetHeight - padding * 2
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
        width: this.$el.offsetWidth - 48,
        height: this.$el.offsetHeight - 48 - 48
      })
      this.enterScene(0)
    },

    async enterScene (index) {
      this.work.scenes[index].visible = true
      this.work.scenes[index].stage = 'enter'
      if (this.currentAutoPlay) {
        this.nextInteval = setTimeout(() => {
          this.currentSceneIndex ++
          this.enterScene(this.currentSceneIndex)
          this.leaveScene(this.currentSceneIndex - 1)
        }, this.work.scenes[index].duration * 1000)
      }
    },

    async leaveScene (index) {
      this.work.scenes[index].stage = 'exist'
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
