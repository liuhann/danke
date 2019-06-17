<template>
<div>
  <nav-bar></nav-bar>
  <div class="section">
    <div class="container">
      <div class="columns is-gapless is-mobile is-multiline" style="margin: 5px;">
        <div class="column is-full-mobile">
          <div id="preview" :style="{background: previewType==='文字'? 'none': ''}">
            <div v-if="previewType==='方块'" class="preview-box" :class="boxClass" :style="frameStyle"></div>
            <div v-if="previewType==='文字'" class="preview-text" :class="boxClass" :style="frameStyle">danke.fun</div>
            <div v-if="previewType==='图片'" class="preview-box" :class="boxClass" :style="frameStyle">
              <img src="http://cdn.danke.fun/res/sample1.png" width="160" height="160">
            </div>

            <div class='clip-note' v-if="currentFrame && currentFrame.clip.type === 'polygon'">
              <div v-for="(point, index) of currentFrame.clip.points" class="circle" :style="{
                left: point[0] + '%',
                top: point[1] + '%'
              }">
              </div>
            </div>
            <div class="columns toolbar">
              <div class="column">
                <div class="buttons has-addons">
                  <span class="button is-small" v-for="ptype of previewTypes" :key="ptype" :class="previewType === ptype? 'is-selected is-info': ''" @click="previewType = ptype">{{ptype}}</span>
                </div>
              </div>
              <div class="column">
                <div class="buttons has-addons is-right">
                  <a class="button is-small" @click="save">
                    <span class="icon">
                      <i class="icon-ok"></i>
                    </span>
                  </a>
                  <a class="button is-small" @click="viewCode">
                    <span class="icon">
                      <i class="icon-code"></i>
                    </span>
                  </a>
                  <a class="button is-small" @click="play">
                    <span class="icon">
                      <i class=" icon-cw"></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">
          <frames-config :animation="animation" class="config" @frame-change="frameChange"></frames-config>
        </div>
      </div>
      <div class="modal" :class="showCode && 'is-active'">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
            <pre>
              {{sourceCode}}
            </pre>
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="showCode = false"></button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import FramesConfig from './FramesConfig'
import { clone } from '../utils/object'
import FRAME from './model/frame'
import { Message } from 'element-ui'
import { createSheet, addAnimationStyle, clearAnimation, getAnimationSourceCode } from './keyframe'
import { getElementStyle } from '../danke-core/utils/styles'
import { setTimeout } from 'timers'
import NavBar from '../site/components/NavBar'

export default {
  name: 'FrameTool',
  components: {
    NavBar,
    FramesConfig
  },
  computed: {
    previewTypes() {
      return ['方块', '文字', '图片']
    },
    currentFrame () {
      return this.animation.frames[this.frameIndex]
    }
  },
  data () {
    const frames = []
    frames.push(clone(FRAME))
    const p100 = clone(FRAME)
    p100.percent = 100
    frames.push(p100)
    return {
      showCode: false,  // source code css-model
      sourceCode: '',
      previewType: '方块',
      animationName: '',
      frameIndex: -1,
      frameStyle: '',
      boxClass: '',
      isEdit: false,
      animation: {
        name: 'my-animation',
        desc: '',
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

  },

  mounted () {
    if (this.ctx.editAnimation) {
      this.isEdit = true
      this.animation = this.ctx.editAnimation
      this.ctx.editAnimation = null
    } else {
      this.isEdit = false
    }
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
      this.sourceCode = getAnimationSourceCode(this.sheet, this.animation)
      this.showCode = true
    },

    async save () {
      if (!this.animation.name) {
        Message.error('请输入动画名称')
        return
      }
      const result = await this.ctx.animdao.addAnimation(this.animation)

      if (result.code === 409) {
        Message.error('动画名称和现有的冲突')
      } else {
        Message.success('保存成功')
      }
    },

    frameChange (index) {
      if (index != null) {
        this.frameIndex = index
      }
      const frame = this.animation.frames[this.frameIndex]
      this.frameStyle = getElementStyle(frame)
      console.log('frame chage', this.frameStyle)
    }
  }
}
</script>
<style lang="scss">
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

  .clip-note {
    width: 160px;
    height: 160px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -80px;
    margin-top: -80px;
    .circle {
      position: absolute;
      width: 14px;
      height: 14px;
      background-color: #ef1;
      border-radius: 14px;
      transform: translateX(-50%) translateY(-50%);
    }
  }
  .preview-text {
    text-transform: uppercase;
    font-size: 2.5rem;
  }
  .toolbar {
    top: 0;
    position: absolute;
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
}


</style>
