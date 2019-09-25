<template>
<div class="slide-lite">
  <div class="device-container" :style="containerStyle">
    <div class="scene" :style="currentScene.style">
      <div v-for="(element, index) of currentScene.elements" :key="element.id" :id="'element-' + element.id"
           class="element" :class="[element.visible?'':'hidden', 'type' + element.type]" :style="element.style + ';' + 'z-index:' + index + ';'"
           @click="chooseElement(element, $event)">
        <!--图片渲染-->
        <img v-if="element.type === TypeEnum.IMAGE || element.type === TypeEnum.SVG" :src="element.url" :style="element.innerStyle || ''">
        <!--文本渲染情况下 文本内容-->
        <span v-if="element.type === TypeEnum.TEXT" v-html="newline(element.text)"></span>
      </div>
    </div>
  </div>
  <div class="upload-image-container" :style="containerStyle" v-if="currentScene.elements.length === 0">
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
      <a class="button is-link">位置</a>
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
  <model-choose-frame ref="dialogFrameChoose" :element="currentElement"></model-choose-frame>
</div>
</template>

<script>
import { Dialog } from 'element-ui'
import { clone } from '../utils/object'
import { getElementStyle, getSceneStyle, getImageWebUrl } from '../danke-core/utils/styles'
import { shortid } from '../utils/string'
import { TypeEnum, IMAGE } from '../danke-core/elements'
import SCENE from '../danke-core/elements/scene'
import DialogAudioTap from '../xd-builder/components/DialogAudioTap.vue'
import ModelChooseFrame from '../frames/ModelChooseFrame.vue'
import ImageDAO from '../common/dao/imagedao'
import getImageSize from '../common/utils/getImageSize'

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
      TypeEnum,
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
    },
    sceneStyle () {
      return {}
    },
    fixAppearances () {
      return [{
        horizontal: 'center',
        vertical: 'center',
        width: '100vw',
        height: '100vw',
        left: 0,
        top: 0
      }]
    }
  },

  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.work.id = shortid()
    this.addNewScene()
  },
  mounted () {
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
    newline (val) {
      return val.replace(/\n/g, '<br>')
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
        const size = await getImageSize(file)
        const result = await this.imagedao.uploadBlob(file, this.work.id)
        debugger
        this.insertRawImage(result.name, size)
      }
    },

    async getImageSize () {

    },
    insertRawImage (url, size) {
      const clonedElement = clone(IMAGE)
      clonedElement.id = shortid()
      clonedElement.name = '图片'
      clonedElement.visible = true
      clonedElement.border.width = 0
      clonedElement.owidth = size.width
      clonedElement.oheight = size.height
      clonedElement.position.horizontal = this.fixAppearances[0].horizontal
      clonedElement.position.vertical = this.fixAppearances[0].vertical
      clonedElement.size.width = this.fixAppearances[0].width
      clonedElement.size.height = this.fixAppearances[0].height
      clonedElement.size.left = this.fixAppearances[0].left
      clonedElement.size.top = this.fixAppearances[0].top
      clonedElement.imgPath = url
      clonedElement.url = getImageWebUrl(clonedElement, this.device)
      const style = getElementStyle(clonedElement, this.device)
      clonedElement.style = style
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
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
  .upload-image-container {
    position: absolute;
    left: 15vw;
    top: 5vw;
    display: flex;
    justify-content: center;
    align-items: center;
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
