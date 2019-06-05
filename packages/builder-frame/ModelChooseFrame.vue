<template>
<div class="modal modal-frame-choose" :class="isShow? 'is-active': ''">
  <div class="modal-background"></div>
  <div class="modal-content frame-box-model">
    <frame-box></frame-box>
  </div>
  <button class="modal-close is-large" aria-label="close" @click="isShow = false"></button>
</div>
</template>

<script>
import { createSheet, addAnimationStyle, clearAnimation } from './keyframe'
import FrameBox from './FrameBox.vue'
export default {
  name: 'ModelChooseFrame',
  components: { FrameBox },
  props: {

  },
  mounted () {
    this.sheet = createSheet()
  },
  data() {
    return {
      isShow: false,
      type: '',
      skip: 0,
      total: 0,
      animations: []
    }
  },
  methods: {
    chooseFrame(type, choosedCallback) {
      this.type = type
      this.skip = 0
      this.animations = []
      this.total = 0
      this.isShow = true
      this.getFrames()
      this.choosedCallback = choosedCallback
    },
    async getFrames () {
      const response = await this.ctx.animdao.getAnimationList(this.type, this.skip, 30)
      this.total = response.total
      this.animations = this.animations.concat(response.list)

      for (let animation of this.animations) {
        addAnimationStyle(this.sheet, animation)
      }
    },
    choose (animation) {
      this.isShow = false
      this.choosedCallback(animation)
    }
  }
}
</script>

<style lang="scss">
.modal-frame-choose {
  z-index: 10001;

  .modal-content {
    background-color: #fff;
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
