<template>
<el-dialog
  title="选择动画效果"
  class="modal-frame-choose"
  top="0"
  :fullscreen="fullscreen"
  :visible.sync="centerDialogVisible">
  <div class="frame-container">
    <frame-box ref="frameBox" :element="element"></frame-box>
  </div>
  <div class="speed">
    <span v-for="speed in animationSpeeds"
          :key="speed.value" @click="chooseSpeed(speed)"
          class="tag is-light" :class="[speed.value === speeds[currentType]? 'is-info': '']">
      {{speed.label}}
    </span>
  </div>
  <span slot="footer" class="dialog-footer">
    <button class="button is-link is-outlined" @click="choose">应用</button>
    <button class="button is-link is-outlined" @click="chooseForAll">应用到所有</button>
  </span>
</el-dialog>
</template>

<script>
import { Dialog } from 'element-ui'
import FrameBox from './FrameBox.vue'
export default {
  name: 'ModelChooseFrame',
  components: {
    FrameBox,
    [Dialog.name]: Dialog
  },
  props: {
    element: {
      type: Object
    },
    fullscreen: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
  },
  data () {
    return {
      centerDialogVisible: false,
      isShow: false,
      type: '',
      currentType: 'in',
      speeds: {
        'in': 200,
        'out': 200,
        'dura': 200
      },
      animationSpeeds: [{
        label: '极快',
        value: 200
      }, {
        label: '快速',
        value: 400
      }, {
        label: '中速',
        value: 600
      }, {
        label: '慢速',
        value: 1000
      }]
    }
  },
  created () {

  },
  methods: {
    chooseSpeed (speed) {
      this.speeds[this.currentType] = speed.value
    },
    chooseAnimation ({ animation, type }) {
      this.currentType = type
      if (this.element) {
        const elementAnimation = this.element.animation[this.currentType]
        elementAnimation.name = animation.name
        elementAnimation.desc = animation.desc
        if (!elementAnimation.duration) {
          elementAnimation.duration = animation.duration
        }
        elementAnimation.cssFrame = animation.cssFrame
        elementAnimation.timing = animation.timing
        elementAnimation.frames = animation.frames
      }
      this.$emit('animation', {
        animation: animation,
        type: type
      })
    },
    chooseFrame (type, choosedCallback) {
      this.currentType = type || 'in'
      this.centerDialogVisible = true
      this.choosedCallback = choosedCallback
    },
    chooseForAll () {
      this.centerDialogVisible = false
      this.$emit('all', this.$refs.frameBox.animationSet, this.speeds)
    },
    choose () {
      this.centerDialogVisible = false
      this.$emit('current', this.$refs.frameBox.animationSet, this.speeds)
    }
  }
}
</script>

<style lang="scss">
.modal-frame-choose {
  z-index: 10001;

  .speed {
    float: left;
  }
  .modal-content {
    background-color: #fff;
  }

  .frame-container {
    height: calc(100% - 200px);
  }

  @media screen and (max-width: 640px) {
    .frame-container {
      height: calc(100% - 40px);
      overflow: auto;
    }
    .frame-navigation {
      height: calc(100% - 96px);
    }
  }
  .frame-box-columns {
    overflow: hidden;
    .column-list {
      overflow-y: auto;
    }
  }

  .play-area {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: rgba(0, 0, 0, .2);
    .preview-box {
      background-color: #FF4B4B;
      width: 80px;
      height: 80px;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
  .play-area:before {
    content: "";
    display: block;
    padding-top: 100%;  /* ratio of 1:1*/
  }
}


</style>
