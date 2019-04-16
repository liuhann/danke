<template>
<div>
  <nav-bar></nav-bar>
  <div class="columns is-mobile is-multiline" style="margin: 5px;">
    <div class="column is-full-mobile">
      <div id="preview" :style="{background: previewType==='文字'? 'none': ''}">
        <div v-if="previewType==='方块'" class="preview-box" :class="boxClass" :style="frameStyle"></div>
        <div v-if="previewType==='文字'" class="preview-text" :class="boxClass" :style="frameStyle">danke.fun</div>
        <div v-if="previewType==='图片'" class="preview-box" :class="boxClass" :style="frameStyle">
          <img src="http://cdn.danke.fun/res/sample1.jpg" width="160" height="160">
        </div>
        <div class="columns toolbar">
          <div class="column">
            <div class="buttons has-addons">
              <span class="button" v-for="ptype of previewTypes" :key="ptype" :class="previewType === ptype? 'is-selected is-info': ''" @click="previewType = ptype">{{ptype}}</span>
            </div>
          </div>
          <div class="column">
            <div class="buttons has-addons is-right">
              <span class="button icon-floppy" @click="share"></span>
              <span class="button icon-code" @click="viewCode"></span>
              <span class="button icon-play" @click="play"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">
      <frames-config :animation="animation" class="config" @frame-change="frameChange"></frames-config>
    </div>
  </div>
  <section class="hero is-large">

  </section>

  <div class="modal" :class="errorMessage && 'is-active'">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        {{errorMessage}}
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="errorMessage = ''"></button>
  </div>

</div>
</template>

<script>
import FramesConfig from './FramesConfig'
import clone from 'clone'
import FRAME from './model/frame'
import { createSheet, addAnimationStyle, clearAnimation } from './keyframe'
import { getElementStyle } from '../style-editor/utils/styles'
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
      errorMessage: '',
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

    viewCode () {

    },

    async share () {
      const result = await this.ctx.animdao.addAnimation(this.animation)
      if (result.code === 409) {
        this.errorMessage = '动画名称和现有的冲突'
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

.container {
  margin: 10px;
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
  height: calc(100vh - 8rem);
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
  .toolbar {
    position: absolute;
    top: 15px;
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  #preview {
    height: 320px;
    .toolbar {
      display: flex;
      margin: 0;
    }
  }
  .column {
    padding: 0;
  }
  .box {
    padding: 10px;
  }
  .field {
    display: flex;
  }
  .field-label {
    margin-bottom: 0;
    margin-right: 10px;
    width: 65px;
  }
}
</style>
