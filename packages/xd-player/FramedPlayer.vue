<!--逐帧播放器-->
<template>
  <div class="framed-player">
    <div v-if="work" id="work-container" class="work-container" :style="deviceStyle">
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
    <div>{{ currentMill }} / {{ finMill }} 信息: {{ msg }}</div>

    <video id="output-video" controls crossorigin></video>
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
    window.ResizeObserver = null
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.onLoaded()
    const that = this

    window.ResizeObserver = null
    
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
      this.ffmpeg = createFFmpeg({ 
        log: true,
        // 必须要指定加载代码和WASM编码的路径， 组件的规则就是使用相同的包路径
        corePath: "http://unpkg.zhimg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js"
      });
      this.msg = 'Loading ffmpeg-core.js'

      await this.ffmpeg.load();
      this.msg = 'Loading data'

      this.frameInc = 1
      
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

    async nextFrameToCanvas() {
      this.currentMill += this.frameStep
      this.frameInc ++
      seekToMill(this.work, this.currentMill)


      this.$nextTick(() => {
        this.msg = 'Capturing Frame ' + this.frameInc
        html2canvas(document.querySelector('#work-container'), {
          useCORS: true,
          scale: 1
        }).then(async canvas => {
          const png = canvas.toDataURL('image/png')
          const ab = this.dataURLtoU8Arr(png)
          await this.ffmpeg.FS('writeFile', `${this.pad(this.frameInc, 6)}.png`, ab);
          if (this.currentMill < this.finMill) {
            this.nextFrameToCanvas()
          } else {
            try {
              this.msg = 'Start ffmpeg transcoding'
              // ffmpeg -r 60 -f image2 -s 900x640 -i %06d.png -vcodec libx264 -crf 16 -pix_fmt yuv420p test.mp4
              // await this.ffmpeg.run('-framerate', '60', '-pattern_type', 'glob','-s', '900x640', '-i', '*.png', '-c:a', 'copy', '-shortest', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', 'out.mp4');
              await this.ffmpeg.run('-r', '60', '-f', 'image2','-s', '900x640', '-i', '%06d.png', '-vcodec', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', 'out.mp4');
              const data = await this.ffmpeg.FS('readFile', 'out.mp4');

              const src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
              window.open(src)
              // const video = document.getElementById('output-video');
              // video.src = src
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
.device {
  .scene {
    position: absolute;
  }
}
</style>
