<template>
<div>
  <nav-bar></nav-bar>
  <div class="tools-container">
    <frames-config :animation="animation" class="config" @frame-change="frameChange"></frames-config>
    <div id="preview" :style="{background: previewType==='文字'? 'none': ''}">
      <div v-if="previewType==='方块'" class="preview-box" :class="boxClass" :style="frameStyle"></div>
      <div v-if="previewType==='文字'" class="preview-text" :class="boxClass" :style="frameStyle">danke.fun</div>
      <div v-if="previewType==='图片'" class="preview-box" :class="boxClass" :style="frameStyle">
        <img src="http://cdn.danke.fun/res/sample1.jpg" width="160" height="160">
      </div>
      <div class="btns">
        <div class="buttons has-addons">
          <span class="button">Yes</span>
          <span class="button is-info is-selected">Maybe</span>
          <span class="button">No</span>
        </div>


        <ul class="tabs is-toggle">
          <li v-for="ptype of previewTypes" :key="ptype" :class="previewType === ptype? 'is-active': ''" @click="previewType = ptype">
            <a>
              <span>{{ptype}}</span>
            </a>
          </li>
          <li class="">
            <a  @click="share">
              <span class="icon-floppy">11</span>
            </a>
          </li>
        </ul>
        <div class="column is-4">
          <i class="button icon-floppy"></i>
          <a class="button  icon-right-open is-text" @click="play"></a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import FramesConfig from './FramesConfig'
import clone from 'clone'
import { toast } from 'bulma-toast'
import FRAME from 'frame-editor/src/model/frame'
import { createSheet, addAnimationStyle, clearAnimation } from 'frame-editor/src/keyframe'
import { getElementStyle } from 'style-editor/src/utils/styles'
import { setTimeout } from 'timers'
import ky from 'ky'
import NavBar from '../common/NavBar'

export default {
  name: 'FrameTool',
  components: {
    NavBar,
    FramesConfig
  },
  computed: {
    previewTypes() {
      return ['方块', '文字', '图片']
    }
  },
  data () {
    const frames = []
    frames.push(clone(FRAME))
    const p100 = clone(FRAME)
    p100.percent = 100
    frames.push(p100)
    return {
      previewType: '方块',
      boxClass: '',
      frameStyle: '',
      animationName: '',
      frameIndex: -1,
      animation: {
        name: 'myAnimation',
        type: '1',
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
      const result = await this.ctx.animdao.addAnimation(this.animation)
      if (result.code === 409) {
        toast({
          duration: 4000,
          position: 'top-center',
          message: '动画名称和现有的冲突',
          type: 'is-danger',
          dismissible: true
        })
      } else {
        toast({
          position: 'top-center',
          message: '保存成功',
          type: "is-success"
        })
      }
    },

    frameChange (index) {
      if (index != null) {
        this.frameIndex = index
      }
      const frame = this.animation.frames[this.frameIndex]
      this.frameStyle = getElementStyle(frame)
    }
  }
}
</script>

<style lang="scss">
.tools-container {
  display: flex;
  height: calc( 100vh - 4rem );
  width: 100%;
  overflow: hidden;
  .animation-config {
    margin: 20px;
    overflow-y: auto;
    width: 320px;
    padding-right: 10px;
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
    .preview-box {
      background-color: #FF4B4B;
      width: 160px;
      height: 160px;
      overflow: hidden;
      box-sizing: border-box;
    }
    .preview-text {
      text-transform: uppercase;
      font-size: 2.5rem;
    }

    .btns {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 400px;
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

</style>
