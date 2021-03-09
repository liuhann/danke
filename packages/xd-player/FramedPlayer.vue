<!--逐帧播放器-->
<template>
  <div class="framed-player">
    <div v-if="work" class="work-container">
      <div class="device" :style="deviceStyle">
        <render-scene v-for="(scene, index) in work.scenes" v-show="scene.visible" :key="index"
                      :auto-play="false"
                      :scene="scene"
                      :stage="scene.stage"
                      :seek="scene.seek"
                      :view-port="work.viewBox"
                      :view-box="work.viewBox"
        />
      </div>
    </div>
    <div>{{ currentMill }}</div>
  </div>
</template>

<script>
import RenderScene from '../xd-builder/render/RenderScene'
import { seekToMill, getWorkDuration } from '../xd-builder/utils/workActions'
import RestDAO from '../utils/restdao'
export default {
  name: "FramedPlayer",
  components: {
    RenderScene
  },
  data () {
    return {
      sceneSeek: 0,
      sceneIndex: 0,
      currentMill: 0,
      finMill: 0,
      frameStep: 16, // 1000/60  60帧的配置
      work: null
    }
  },
  computed: {
    deviceStyle () {
      return {
        width: this.work.viewBox.width + 'px',
        height: this.work.viewBox.height + 'px'
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.onLoaded()
    const that = this
    document.nextFrame = function () {
      that.nextFrame()
    }
  },
  methods: {
    async onLoaded () {
      const work = await this.workdao.getOne(this.$route.params.id)

      // 初始化处理， 每个场景都设置为 visible = false
      for (let scene of work.scenes) {
        scene.visible = false
        scene.seek = 0
        scene.stage = 'before'
      }
      this.finMill = getWorkDuration(work)

      this.work = work
      this.startPlay()
    },

    async startPlay () {
      this.nextFrame()
    },

    async nextFrame () {
      this.currentMill += this.frameStep
      seekToMill(this.work, this.currentMill)

      if (this.currentMill < this.finMill) {
        if (window.frameReady) {
          this.$nextTick(() => {
            window.frameReady(this.currentMill)
          })
        } else {
          setTimeout(() => {
            this.nextFrame()
          }, 16)
        }

      }
    }
  }
}
</script>

<style lang="scss">
.device {
  .scene {
    position: absolute;
  }
}
</style>
