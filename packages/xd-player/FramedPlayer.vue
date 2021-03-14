<!--逐帧播放器-->
<template>
  <div class="framed-player">
    <div v-if="work" class="work-container" id="work-container">
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
    <div><button @click="convertToVideo">运算</button></div>
    <div>{{ currentMill }} 信息: {{ msg }}</div>

    <video id="output-video" controls></video>
  </div>
</template>

<script>
import RenderScene from '../xd-builder/render/RenderScene'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import html2canvas from 'html2canvas'
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
      msg: '',
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
      // this.startPlay()
    },

    async startPlay () {
      this.nextFrame()
    },

    async convertToVideo () {
      const ffmpeg = createFFmpeg({ log: true });
      this.msg = 'Loading ffmpeg-core.js'

      await ffmpeg.load();
      this.msg = 'Loading data'


      this.frameInc = 1
      
      this.nextFrameToCanvas()
    },

    async nextFrameToCanvas() {
      this.currentMill += this.frameStep
      this.frameInc ++
      seekToMill(this.work, this.currentMill)


      this.$nextTick(() => {
        this.msg = 'Capturing Frame ' + this.frameInc
        html2canvas(document.querySelector('#work-container'), {
          useCORS: true,
          scale: 1
        }).then(canvas => {
          canvas.toBlob(async blob => {
            await this.ffmpeg.FS('writeFile', `tmp.${this.frameInc}.png`, blob);
            if (this.currentMill < this.finMill) {
              this.nextFrameToCanvas()
            } else {
              this.msg = 'Start ffmpeg transcoding'
              await ffmpeg.run('-framerate', '60', '-pattern_type', 'glob', '-i', '*.png', '-c:a', 'copy', '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', 'out.mp4');
              const data = ffmpeg.FS('readFile', 'out.mp4');
              const video = document.getElementById('output-video');
              video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            }
          })
        });
      })
    },

    async nextFrame () {
      this.currentMill += this.frameStep
      seekToMill(this.work, this.currentMill)

      // 触发下一帧操作
      if (this.currentMill < this.finMill) {
        // 在puppeteer中运行
        if (window.frameReady) {
          this.$nextTick(() => {
            window.frameReady(this.currentMill)
          })
        } else {
          // 自动触发
          setTimeout(() => {
            this.nextFrame()
          }, 16)
        }
      } else {
        window.frameEnd && window.frameEnd()
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
