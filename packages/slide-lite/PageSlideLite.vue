<template>
<div class="slide-lite">
  <div class="device-container">
    <div class="field upload-image">
      <div class="file is-primary is-medium">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" @input="imageChoosed">
          <span class="file-cta">
            <span class="file-label">
              选择图片
            </span>
          </span>
        </label>
      </div>
    </div>
  </div>

  <a class="button is-success next">
    <span class="icon is-small">
      <i class="icon-left-open-outline"></i>
    </span>
  </a>
  <a class="button is-success prev">
    <span class="icon is-small">
      <i class="icon-right-open-outline"></i>
    </span>
  </a>

  <div class="icon-left-open-outline">
  </div>
  <div class="icon-right-open-outline">
  </div>
  <div class="tri-button">
    <a class="button is-link">Link</a>
    <a class="button is-info">Info</a>
    <div class="file is-success">
      <label class="file-label">
        <input class="file-input" type="file" name="chooseaudio" @input="audioChoosed">
        <span class="file-cta">
          <span class="file-label">上传音频</span>
        </span>
      </label>
    </div>
  </div>
  <dialog-audio-tap :setName="false" :fullscreen="true" ref="dialogAudioList" @audio="chooseAudio"></dialog-audio-tap>
</div>
</template>

<script>
import { Dialog } from 'element-ui'
import './fontello/css/fontello.css'
import DialogAudioTap from '../xd-builder/components/DialogAudioTap.vue'
export default {
  components: { DialogAudioTap, Dialog },
  data () {
    return {
      work: {
        ratio: '9:16',
        id: '',
        title: '',
        categories: [],
        desc: '',
        audioUrl: '',
        audioName: '',
        audioTicks: [],
        duration: 0,
        resources: [],
        scenes: []
      },
      currentScene: {},
      currentElement: null,
    }
  },
  methods: {
    audioChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        this.$refs.dialogAudioList.openWithAudioFile(file)
      }
    },
     openAudioDialog () {
      this.$refs.dialogAudioList.open(this.work)
    },
    chooseAudio (audioItem) {
      this.work.audioUrl = audioItem.audioUrl
      this.work.audioName = audioItem.name
      this.work.audioTicks = audioItem.ticks
    },
    async imageChoosed (e) {
      // 先上传 然后获取剪切后的url
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        this.$emit('input', URL.createObjectURL(file))
        this.$emit('blob', file)
      }
    }
  }
}
</script>

<style lang="scss">
.slide-lite {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  // background: url('./bg.png');
  background-size: cover;
  .device-container {
    background-color: aliceblue;
    height: 140vw;
    left: 15vw;
    top: 5vw;
    position: absolute;
    border-radius: 20px;
    width: 70vw;
  }
  .button.next {
    position: absolute;
  }

  .tri-button {
    position: absolute;
    bottom: 5vw;
  }

  .btn {
    padding: 1rem;
    border-radius: 1.5rem;
    background-color: #f6e58d;
    color: #000;
    transition: all .5s ease 0s;
    box-shadow: 0 10px #f9ca24;
  }
}

</style>