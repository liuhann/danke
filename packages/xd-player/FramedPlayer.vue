<template>
  <div class="framed-recorder">
    <div class="full-screened" style="z-index: -2; overflow: hidden;">
      <div v-if="work" id="device" class="device" :style="deviceStyle">
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
    <div class="full-screened" style="z-index: -1; overflow: hidden; background-color: #222;" />
    <div class="layout">
      <div class="left">
        <div class="actions">
          <div class="btns">
            <button v-if="!started" @click="convertToVideo">生成视频</button>
            <button v-if="!previewPlaying" @click="previewPlay">播放</button>
            <button v-if="started" @click="pause = !pause">暂停</button>
          </div>
          <div class="msg">
            {{ msg }}
          </div>
          <div class="progress">
            <progress :value="currentMill" :max="finMill" :text-inside="true" :stroke-width="24" :percentage="100" status="success" />
            {{ currentMill }} / {{ finMill }}
          </div>
        </div>
        <div id="container-box" class="container-box">
          <div v-if="work" id="work-container" class="work-container" :style="viewPortContainerStyle">
            <img v-if="!previewPlaying" :src="currentFrameUrl" />
            <div v-if="previewPlaying" class="device" :style="deviceStyle">
              <render-scene v-for="(scene, index) in work.scenes" v-show="scene.visible" :key="index"
                            auto-play
                            :scene="scene"
                            :stage="scene.stage"
                            :view-port="viewPort"
                            :view-box="work.viewBox"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="output">
          <video id="output-video" controls crossorigin></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RenderScene from '../xd-builder/render/RenderScene'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import html2canvas from 'html2canvas'
import { seekToMill, getWorkDuration, scheduleWorkPlay } from '../xd-builder/utils/workActions'
import RestDAO from '../utils/restdao'
import ImageDAO from '../utils/imagedao'
import { Progress } from 'element-ui'
import { fitRectIntoBounds } from '../xd-builder/mixins/rectUtils'

export default {
  name: "FramedPlayer",
  components: {
    RenderScene,
    Progress
  },
  data () {
    return {
      sceneSeek: 0,
      sceneIndex: 0,
      currentMill: 0,
      previewPlaying: false,
      finMill: 0,
      msg: '',
      frameStep: 16, // 1000/60  60帧的配置
      viewPort: {
        width: 0,
        height: 0
      },
      currentFrameUrl: null,
      started: false,
      pause: false,
      work: null
    }
  },
  computed: {
    deviceStyle () {
      return {
        width: this.work.viewBox.width + 'px',
        height: this.work.viewBox.height + 'px'
      }
    },
    viewPortContainerStyle () {
      return {
        width: this.viewPort.width + 'px',
        height: this.viewPort.height + 'px'
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.imagedao = new ImageDAO(this.ctx)
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
        scene.seek = 30
        scene.stage = 'before'
      }
      this.finMill = getWorkDuration(work)

      this.work = work

      const containerRect = document.querySelector('#container-box').getBoundingClientRect()

      const fit = fitRectIntoBounds(work.viewBox, containerRect)

      this.viewPort.width = fit.width
      this.viewPort.height = fit.height
      console.log(fit)
      // this.startPlay()
    },

    async previewPlay () {
      this.previewPlaying = true
      await scheduleWorkPlay(this.work)
      this.previewPlaying = false
    },

    async startPlay () {     
      this.nextFrame()
    },

    async convertToVideo () {
      this.ffmpeg = createFFmpeg({ 
        log: true,
        // 必须要指定加载代码和WASM编码的路径， 组件的规则就是使用相同的包路径
        corePath: "http://unpkg.zhimg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js"
      });
      this.msg = 'Loading ffmpeg-core.js'

      await this.ffmpeg.load();
      this.msg = 'Loading data'

      this.frameInc = 1
      this.started = true
      this.nextFrameToCanvas()
    },

    async getBlobArrayBuffer (blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function() {
          resolve(this.result)
        }
        reader.readAsArrayBuffer(blob)
      })
    },

    base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    },
    
    dataURLtoU8Arr(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return u8arr
    },

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },

    async pauseResume () {
      if (this.pause) {
        this.pause = false
        this.nextFrameToCanvas()
      } else {
        this.pause = true
      }
    },

    async nextFrameToCanvas() {
      this.currentMill += this.frameStep
      this.frameInc ++
      seekToMill(this.work, this.currentMill)

      this.$nextTick(() => {
        this.msg = 'Capturing Frame ' + this.frameInc
        html2canvas(document.querySelector('#device'), {
          backgroundColor: null,
          useCORS: true,
          scale: 1
        }).then(async canvas => {
          const png = canvas.toDataURL('image/png')
          const ab = this.dataURLtoU8Arr(png)
          this.currentFrameUrl = png
          await this.ffmpeg.FS('writeFile', `${this.pad(this.frameInc, 6)}.png`, ab);
          if (this.currentMill < this.finMill) {
            if (!this.pause) {
              this.nextFrameToCanvas()
            }
          } else {
            try {
              this.msg = 'Start ffmpeg transcoding'
              // ffmpeg -r 60 -f image2 -s 900x640 -i %06d.png -vcodec libx264 -crf 16 -pix_fmt yuv420p test.mp4
              // await this.ffmpeg.run('-framerate', '60', '-pattern_type', 'glob','-s', '900x640', '-i', '*.png', '-c:a', 'copy', '-shortest', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', 'out.mp4');
              await this.ffmpeg.run('-r', '60', '-f', 'image2','-s', this.work.viewBox.width + 'x' + this.work.viewBox.height, '-i', '%06d.png', '-vcodec', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', 'out.mp4');
              const data = await this.ffmpeg.FS('readFile', 'out.mp4');

              const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' })
              const src = URL.createObjectURL(mp4Blob);
              const video = document.getElementById('output-video');
              video.src = src

              let uploading = await this.imagedao.uploadBlob(mp4Blob, `public/video/${this.work.id}.mp4`, true);
              this.msg = 'ffmpeg transcoded!!'
            } catch (e) {
              console.log(e)
            }
            
          }
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

.full-screened {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.framed-recorder {
  height: 100%;
}

.layout {
  height: 100%;
  display: flex;
  background-color: #333;
  padding: 20px;
  .left {
    width: 75%;
    .actions {
      font-size: 20px;
      line-height: 40px;
      height: 55px;
      display: flex;
      button {
        padding: 5px 10px;
        cursor: pointer;
        font-size: 16px;
      }
      .msg {
        flex: 1;
        text-align: center;
        color: #eee;
      }
      .btns, .progress {
        width: 320px;
        height: 55px;
        color: #eee;
      }
    }
    .container-box {
      height: calc(100% - 80px);
      display: flex;
      justify-content: center;
      align-items: center;
      .work-container {
        box-sizing: border-box;
        border: 3px solid #cc2836;
        border-top: 12px solid #cc2836;
        &.recording {
          border: 3px solid #cc28363d;
          border-top: 12px solid #cc28363d;
        }
        .work-wrapper {
          transform-origin: top left;
        }
      }
    }
  }
  .right {
    width: 25%;
    padding: 10px;
  }
}
.device {
  .scene {
    position: absolute;
    overflow: hidden;
  }
}
</style>
