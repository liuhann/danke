<template>
<div class="slide-lite">
  <div class="device-container" :style="containerStyle">
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
  <div class="btn-next">
    <img src="./arrow-btn.png">
  </div>
  <div class="btn-prev">
    <img src="./arrow-btn.png">
  </div>
  <div class="tri-button columns is-mobile is-centered">
    <div class="column is-narrow">
      <a class="button is-link">大小</a>
    </div>
    <div class="column is-narrow">
      <a class="button is-info" @click="chooseAnimation">效果</a>
    </div>
    <div class="column is-narrow">
      <div class="file is-success">
        <label class="file-label">
          <input class="file-input" type="file" name="chooseaudio" @input="audioChoosed">
          <span class="file-cta">
          <span class="file-label">上传音频</span>
        </span>
        </label>
      </div>
    </div>
  </div>
  <dialog-audio-tap :setName="false" audioPath="tickAudio" :fullscreen="true" ref="dialogAudioList" @audio="chooseAudio"></dialog-audio-tap>
  <model-choose-frame ref="dialogFrameChoose"></model-choose-frame>
</div>
</template>

<script>
import { Dialog } from 'element-ui'
import { clone } from '../utils/object'
import { getSceneStyle } from '../danke-core/utils/styles'
import { shortid } from '../utils/string'
import SCENE from '../danke-core/elements/scene'
import DialogAudioTap from '../xd-builder/components/DialogAudioTap.vue'
import ModelChooseFrame from '../frames/ModelChooseFrame.vue'

export default {
  components: { DialogAudioTap, Dialog, ModelChooseFrame },
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
      device: {
        width: 100,
        height: 100
      },
      currentScene: {},
      currentElement: null
    }
  },
  computed: {
    containerStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },
  mounted () {
    this.work.id = shortid()
    this.device.width = window.screen.availWidth * 0.7
    this.device.height = window.screen.availHeight * 0.7
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
      this.work.duration = audioItem.dura
      this.work.audioTicks = audioItem.ticks
    },

    chooseAnimation () {
      this.$refs.dialogFrameChoose.chooseFrame('in')
    },

    addNewScene () {
      const scene = clone(SCENE)
      scene.name = '场景 ' + (this.work.scenes.length + 1)
      scene.id = shortid()
      scene.style = getSceneStyle(scene, this.device)
      this.work.scenes.push(scene)
      this.chooseScene(scene)
    },
    applyWorkTicksToScenes () {

    },

    nextScene () {

    },

    prevScene () {

    },
    chooseScene (scene) {
      this.chooseElement(null)
      this.currentScene = scene
    },

    chooseElement (element, event) {
      this.elementChoosed && this.elementChoosed()
      this.currentElement = element
    },
    async imageChoosed (e) {
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
  background: url('./bg.png');
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
  .btn-next {
    position: absolute;
    right: 3vw;
    top: 65vw;
    width: 10vw;
  }

  .btn-prev {
    position: absolute;
    left: 3vw;
    top: 65vw;
    width: 10vw;
    transform: rotate(180deg);
  }

  .tri-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
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
