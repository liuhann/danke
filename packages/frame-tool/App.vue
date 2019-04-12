<template>
  <div id="app">
    <frames-config :animation="animation" class="config" @frame-change="frameChange"></frames-config>
    <div id="preview">
      <div id="box" class="box" :class="boxClass" :style="frameStyle"></div>
      <div class="btns">
        <el-button @click="play" type="text" size="medium" icon="el-icon-caret-right"></el-button>
        <el-button @click="share" type="text" icon="el-icon-share"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Button, Message } from 'element-ui'
import FramesConfig from './FramesConfig'
import clone from 'clone'
import FRAME from './model/frame'
import { createSheet, addAnimationStyle, clearAnimation } from './keyframe'
import { getElementStyle } from 'style-editor/src/utils/styles'
import { setTimeout } from 'timers'
import ky from 'ky'

Vue.use(Button)

export default {
  name: 'app',
  components: {
    FramesConfig
  },
  computed: {

  },
  data () {
    const frames = []
    frames.push(clone(FRAME))
    const p100 = clone(FRAME)
    p100.percent = 100
    frames.push(p100)
    return {
      boxClass: '',
      frameStyle: '',
      animationName: '',
      frameIndex: -1,
      animation: {
        name: 'myAnimation',
        duration: 600,
        iteration: 1,
        delay: 0,
        timing: 'linear',
        infinite: false,
        frames: frames
      }
    }
  },
  watch: {
  },
  created () {
    this.client = ky.extend({
      prefixUrl: 'http://www.danke.fun/api/',
      throwHttpErrors: false
    })
  },

  mounted () {
  },

  methods: {
    play () {
      if (this.sheet) {
        clearAnimation(this.sheet)
      }
      this.sheet = createSheet()
      this.boxClass = ''
      addAnimationStyle(this.sheet, this.animation)
      // this.boxClass = 'hidden'
      this.frameStyle = ''
      setTimeout(() => {
        this.boxClass = this.animation.name
      }, 300)
    },

    async share () {
      const result = await this.client.put('animation', {
        json: this.animation
      }).json()
      if (result.code === 409) {
        Message({
          message: '动画名称和现有的冲突',
          type: 'warning'
        })
      } else {
        Message({
          message: '保存成功'
        })
      }
    },

    frameChange (index) {
      if (index != null) {
        this.frameIndex = index
      }
      const frame = this.animation.frames[this.frameIndex]
      console.log('frame change', frame)
      this.frameStyle = getElementStyle(frame)
    }
  }
}
</script>

<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;
}

#app {
  background-color: #252423;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  color: #2c3e50;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .animation-config {
    overflow-y: auto;
    width: 320px;
    padding-right: 10px;
    background-color: #F5F5F5;
  }

  #preview {
    position: relative;
    background-image: linear-gradient(90deg, #592D2D, #592D2D);
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: 160px 160px;
    background-position: center;
    background-repeat: no-repeat;
    #box {
      background-color: #FF4B4B;
      width: 160px;
      height: 160px;
      overflow: hidden;
      box-sizing: border-box;
    }

    .btns {
      position: absolute;
      right: 10px;
      top: 10px;
      .el-button--text {
        color: #F6F4F2;
        font-size: 20px;
      }
    }
  }

}

@media screen and (max-width: 600px) {
  #app {
    flex-direction: column-reverse;
    .animation-config {
      overflow-y: auto;
      width: 100%;
      padding-right: 10px;
      background-color: #F5F5F5;
      flex: 1;
    }
    #preview {
      height: 240px;
    }
  }
}

.hidden {
  display: none;
}

::-webkit-scrollbar {
  width: 6px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  background-color: #0ae;
  background-image: -webkit-gradient(linear, 0 0, 0 100%, color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.5, transparent), to(transparent));
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #F5F5F5;
}

</style>
