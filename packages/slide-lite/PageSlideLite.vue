<template>
<div class="slide-lite">
  <div class="device-container" :style="containerStyle">
    <div class="scene" :style="currentScene.style" @click.self="setBackground">
      <div v-for="(element, index) of currentScene.elements" :key="element.id" :id="'element-' + element.id"
           class="element" :class="[element.visible?'':'hidden', 'type' + element.type]" :style="element.style + ';' + 'z-index:' + index + ';'"
           @click="chooseElement(element)">
        <!--图片渲染-->
        <img v-if="element.type === TypeEnum.IMAGE || element.type === TypeEnum.SVG"
             :src="element.url"
             crossOrigin="true">
        <!--文本渲染情况下 文本内容-->
        <span v-if="element.type === TypeEnum.TEXT" v-html="newline(element.text)"></span>
      </div>
    </div>
    <span class="tag is-light tag-page">{{this.currentSceneIndex + 1}}/ {{this.work.scenes.length}}</span>
    <a v-if="currentScene.elements.length" @click="deleteScene" class="delete is-large"></a>
  </div>
  <div class="upload-image-container" :style="containerStyle" v-if="currentScene.elements.length === 0">
    <upload-button btn-style="is-primary is-medium" @files="imageChoosed" :isMultiple="true"></upload-button>
    <span class="tag is-light tag-page">{{this.currentSceneIndex + 1}}/ {{this.work.scenes.length}}</span>
  </div>
  <div class="btn-next">
    <img src="./arrow-btn.png" @click="nextScene">
  </div>
  <div class="btn-prev" @click="prevScene">
    <img src="./arrow-btn.png">
  </div>

  <div class="tri-button columns is-mobile is-centered">
    <div class="column is-narrow">
      <a class="button is-medium is-info btn-home" @click="$router.replace('/slide/lite/list')">首页</a>
    </div>
    <div class="column is-narrow">
      <upload-button btn-style="is-primary is-medium" @file="audioChoosed">上传音频</upload-button>
    </div>
    <div class="column is-narrow" v-if="work.audioUrl">
      <a class="button is-info is-medium" @click="playAndSetTicks">{{ticksEditing ? '停止': '校准'}}</a>
    </div>
    <div class="column is-narrow">
      <a class="button is-info is-medium" @click="runWork">运行</a>
    </div>
  </div>
  <!--  操作图片的对话框-->
  <el-dialog :visible.sync="dialogShowElementMenu" title="设置图片" width="75%" top="30vh" custom-class="dialog-edit-menu">
    <a class="button is-medium is-fullwidth" @click="setBackground">背景设置</a>
    <a class="button is-medium is-fullwidth" @click="setImageSize">图片位置及大小</a>
    <upload-button btn-style="is-primary is-medium" @file="imageReplaced" label="更换图片" />
    <a class="button is-medium is-fullwidth" @click="chooseAnimation">动画特效</a>
  </el-dialog>
  <el-dialog :visible.sync="dialogShowChooseSize" title="设置图片位置和大小" width="100%" top="20vh" custom-class="dialog-image-size">
    <a class="button is-medium is-fullwidth" v-for="(appearance, index) in fixAppearances" :key="index" @click="setAppearance(appearance)">{{appearance.label}}</a>
  </el-dialog>
  <el-dialog :visible.sync="dialogShowSetBackground"  title="设置背景" width="100%" top="0" custom-class="dialog-set-background">
    <div class="palettes">
      <div v-for="(color, key) in paletteColors" :key="key" class="color"
           @click="setBackgroundColor(color)"
           :style="{
            backgroundColor: color
           }">{{key}}</div>
    </div>
  </el-dialog>
  <dialog-audio-tap :setName="false" audioPath="tickAudio" :fullscreen="true" ref="dialogAudioList" @audio="chooseAudio"></dialog-audio-tap>
  <model-choose-frame ref="dialogFrameChoose" @current="setCurrentAnimation" @all="setAllAnimation"></model-choose-frame>
</div>
</template>

<script>
import { Dialog, Message, Loading } from 'element-ui'
import { clone } from '../utils/object'
import { getElementStyle, getImageWebUrl, getSceneStyle } from '../danke-core/utils/styles'
import { shortid } from '../utils/string'
import { TypeEnum, IMAGE } from '../danke-core/elements'
import SCENE from '../danke-core/elements/scene'
import DialogAudioTap from '../xd-builder/components/DialogAudioTap.vue'
import ModelChooseFrame from '../frames/ModelChooseFrame.vue'
import ImageDAO from '../common/dao/imagedao'
import RestDAO from '../common/dao/restdao'
import UploadButton from './UploadButton.vue'
import fixedAppearances from './fixedAppearances'

export default {
  components: { UploadButton, DialogAudioTap, [Dialog.name]: Dialog, ModelChooseFrame },
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
      currentSceneIndex: 0,
      currentScene: {},
      currentElement: null,
      currentAppearance: fixedAppearances[1],
      currentBackground: '#ffffff',
      fixAppearances: fixedAppearances,
      paletteColors: {
        aqua: '#7fdbff',
        blue: '#0074d9',
        navy: '#001f3f',
        teal: '#39cccc',
        olive: '#3d9970',
        green: '#2ecc40',
        red: '#ff4136',
        maroon: '#85144b',
        orange: '#ff851b',
        purple: '#b10dc9',
        yellow: '#ffdc00',
        fuchsia: '#f012be',
        gray: '#aaaaaa',
        white: '#ffffff',
        black: '#111111',
        silver: '#dddddd'
      },
      ticksEditing: false,
      dialogShowChooseSize: false,
      dialogShowElementMenu: false,
      dialogShowSetBackground: false
    }
  },
  computed: {
    containerStyle () {
      return {
        backgroundColor: this.currentBackground,
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },

  created () {
    this.device.width = window.screen.availWidth * 0.7
    this.device.height = window.screen.availHeight * 0.7
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    const work = this.ctx.editWork
    if (work) {
      this.work = work
      this.initWorkStyle()
    } else {
      this.work.id = shortid()
      this.addNewScene()
    }
    this.currentSceneIndex = 0
    this.chooseScene()
  },
  mounted () {
  },
  methods: {
    initWorkStyle () {
      for (const scene of this.work.scenes) {
        for (const element of scene.elements) {
          element.url = getImageWebUrl(element, this.device)
          element.style = getElementStyle(element, this.device)
        }
        scene.style = getSceneStyle(scene, this.device)
      }
    },
    audioChoosed (file) {
      this.$refs.dialogAudioList.openWithAudioFile(file)
    },
    chooseAudio (audioItem) {
      this.work.audioUrl = audioItem.audioUrl
      this.work.audioName = audioItem.name
      this.work.duration = audioItem.dura
      this.work.audioTicks = audioItem.ticks
      this.applyWorkTicksToScenes()
    },
    chooseAnimation () {
      this.$refs.dialogFrameChoose.chooseFrame('in')
      this.dialogShowElementMenu = false
    },

    setCurrentAnimation (animationSet, speed) {
      this.setElementAnimation(this.currentElement, animationSet, speed)
    },
    setAllAnimation (animationSet, speed) {
      for (let scene of this.work.scenes) {
        for (let element of scene.elements) {
          this.setElementAnimation(element, animationSet, speed)
        }
      }
    },
    setElementAnimation (element, animationSet, speed) {
      for (let type in animationSet) {
        const elementAnimation = element.animation[type]
        const animation = animationSet[type]
        elementAnimation.name = animation.name
        elementAnimation.desc = animation.desc
        elementAnimation.duration = speed[type]
        elementAnimation.cssFrame = animation.cssFrame
        elementAnimation.timing = animation.timing
        elementAnimation.frames = animation.frames
      }
    },
    /**
     * 增加新的空白场景
     */
    addNewScene () {
      const scene = clone(SCENE)
      scene.background.colors = [this.currentBackground]
      scene.name = '场景 ' + (this.work.scenes.length + 1)
      scene.id = shortid()
      scene.style = getSceneStyle(scene, this.device)
      this.work.scenes.push(scene)
    },

    deleteScene () {
      this.work.scenes.splice(this.currentSceneIndex, 1)
      if (this.work.scenes.length === 0) {
        this.addNewScene()
        this.currentSceneIndex = 0
      } else {
        if (this.currentSceneIndex > 0) {
          this.currentSceneIndex--
        }
        this.chooseScene()
      }
    },
    nextScene () {
      if (this.ticksEditing) {
        this.work.audioTicks.push(this.audio.currentTime)
      }
      if (this.currentSceneIndex === this.work.scenes.length - 1) {
        this.addNewScene()
      }
      this.currentSceneIndex++
      this.chooseScene()
      this.renderScene(this.currentScene, 'in')
      this.renderScene(this.work.scenes[this.currentSceneIndex - 1], 'out')
    },
    prevScene () {
      if (this.ticksEditing) {
        return
      }
      if (this.currentSceneIndex > 0) {
        this.currentSceneIndex--
        this.chooseScene()
        this.renderScene(this.currentScene, 'in')
        this.renderScene(this.work.scenes[this.currentSceneIndex + 1], 'out')
      }
    },
    /**
     * 选择到某个场景
     * @param scene
     */
    chooseScene (scene) {
      if (scene == null) {
        this.currentScene = this.work.scenes[this.currentSceneIndex]
      } else {
        this.currentScene = scene
      }
    },
    renderScene (scene, stage) {
      for (let element of scene.elements) {
        element.style = getElementStyle(element, this.device, stage)
      }
      scene.style = `display: inherit; ${getSceneStyle(scene, this.device, stage)}`
    },
    /**
     * 设置音乐的节拍到每个场景切换之上， 同时自动补齐所需的图片数量
     **/
    applyWorkTicksToScenes () {
      let last = 0
      if (this.work.audioTicks) {
        for (let i = 0; i < this.work.audioTicks.length; i++) {
          if (this.work.scenes[i]) {
            this.work.scenes[i].leave = Math.floor(this.work.audioTicks[i] * 1000) - last
            last = Math.floor(this.work.audioTicks[i] * 1000)
          }
        }
      }
      if (this.work.scenes.length < this.work.audioTicks.length) {
        Message.success({
          message: '按照音乐与节拍，您还需补充' + (this.work.audioTicks.length - this.work.scenes.length) + '张图片'
        })
        for (let i = this.work.scenes.length; i < this.work.audioTicks.length; i++) {
          this.addNewScene()
          this.work.scenes[i].leave = Math.floor(this.work.audioTicks[i] * 1000) - last
          last = Math.floor(this.work.audioTicks[i] * 1000)
        }
      } else if (this.work.scenes.length > this.work.audioTicks.length) {
        Message.warning({
          message: '注意:您有' + (this.work.scenes.length - this.work.audioTicks.length) + '张图片没有默认节拍'
        })
      }
    },
    newline (val) {
      return val.replace(/\n/g, '<br>')
    },
    chooseElement (element, event) {
      this.currentElement = element
      this.dialogShowElementMenu = true
    },
    async imageChoosed (files) {
      const loading = Loading.service({
        lock: true,
        text: '正在保存图片',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.6)'
      })
      let isFirst = true
      for (let file of files) {
        const result = await this.imagedao.uploadBlob(file, this.work.id)
        if (isFirst) {
          this.insertRawImage(result.name, file)
          isFirst = false
        } else {
          // 新增场景并插入图片
          this.addNewScene()
          this.currentSceneIndex = this.work.scenes.length - 1
          this.chooseScene()
          this.insertRawImage(result.name, file)
        }
      }
      loading.close()
    },

    // 选择更换当前的图片
    async imageReplaced (file) {
      const loading = Loading.service({
        lock: true,
        text: '正在更换图片',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.6)'
      })
      const result = await this.imagedao.uploadBlob(file, this.work.id)
      if (this.currentScene.elements.length) {
        const clonedElement = this.currentScene.elements[0]
        clonedElement.id = shortid()
        clonedElement.imgPath = result.name
        // 这里还是使用本地地址, 因为微信不显示远程动态加载的图片
        clonedElement.url = URL.createObjectURL(file)
        this.setElementAppearance(clonedElement, this.currentAppearance, this.device)
      }
      loading.close()
    },
    /**
     * 设置图片的大小及位置
     */
    setImageSize () {
      this.dialogShowChooseSize = true
      this.dialogShowElementMenu = false
    },
    setAppearance (appearance) {
      this.currentAppearance = appearance
      for (const scene of this.work.scenes) {
        for (const element of scene.elements) {
          if (element.type === TypeEnum.IMAGE) {
            this.setElementAppearance(element, appearance, this.device)
          }
        }
      }
      this.dialogShowChooseSize = false
    },
    /**
     * 设置元素位置大小到指定样式
     **/
    setElementAppearance (element, appearance, device) {
      element.position.horizontal = appearance.horizontal
      element.position.vertical = appearance.vertical
      element.size.width = appearance.width
      element.size.left = appearance.left
      element.size.top = appearance.top
      element.size.height = appearance.height
      // this.currentElement.url = getImageWebUrl(this.currentElement, this.device)
      const style = getElementStyle(element, device)
      element.style = style
    },

    setBackground () {
      this.dialogShowSetBackground = true
      this.dialogShowElementMenu = false
    },
    setBackgroundColor (color) {
      this.currentBackground = color
      for (const scene of this.work.scenes) {
        scene.background.colors = [color]
        scene.style = getSceneStyle(scene, this.device)
      }
      this.dialogShowSetBackground = false
    },
    /**
     * 给当前画面插入新的图片
     **/
    insertRawImage: function (url, file) {
      const clonedElement = clone(IMAGE)
      clonedElement.id = shortid()
      clonedElement.name = '图片'
      clonedElement.visible = true
      clonedElement.border.width = 0
      clonedElement.imgPath = url
      // 这里还是使用本地地址, 因为微信不显示远程动态加载的图片
      clonedElement.url = URL.createObjectURL(file)
      this.currentScene.elements.push(clonedElement)
      this.currentElement = clonedElement
      this.setElementAppearance(clonedElement, this.currentAppearance, this.device)
    },

    /**
     * 保存整个作品
     **/
    async saveWork () {
      const loading = Loading.service({
        lock: true,
        text: '正在保存中',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.6)'
      })
      // save scene preview
      const work = this.getWorkConfig()
      if (!this.work._id) {
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
      } else {
        await this.workdao.patch(work._id, work)
      }
      loading.close()
      Message.success('保存完成')
    },

    /**
     * 抽取work的内容，去除计算过的style
     * @returns {any}
     */
    getWorkConfig () {
      const work = JSON.parse(JSON.stringify(this.work))
      work.user = this.ctx.user.id
      for (let i = 0; i < work.scenes.length; i++) {
        const scene = work.scenes[i]
        for (let element of scene.elements) {
          element.style = ''
        }
        scene.style = ''
      }
      work.token = this.ctx.token
      return work
    },

    async runWork () {
      await this.saveWork()
      window.open('/play/full/' + this.work._id)
    },

    async playAndSetTicks () {
      const editor = this
      if (!this.ticksEditing) {
        this.currentSceneIndex = 0
        this.chooseScene()
        this.ticksEditing = true
        this.work.audioTicks = []
        if (this.work.audioUrl) {
          this.audio = new Audio('http://image.danke.fun/' + this.work.audioUrl)
          const playPromise = this.audio.play()
          if (playPromise !== undefined) {
            await playPromise
          }
          this.audio.onended = async function () {
            editor.ticksEditing = false
          }
        }
      } else {
        this.ticksEditing = false
        if (this.audio) {
          this.audio.pause()
        }
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
    overflow: hidden;
    height: 140vw;
    left: 15vw;
    top: 5vw;
    position: absolute;
    border-radius: 20px;
    width: 70vw;
    .delete.is-large {
      position: absolute;
      bottom: 3vw;
      left: calc(50% - 16px);
    }
    .tag-page {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
  .upload-image-container {
    position: absolute;
    left: 15vw;
    top: 5vw;
    display: flex;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    .tag-page {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
  .btn-new {
    position: absolute;
    right: 1vw;
    top: 1vw;
  }
  .btn-next {
    position: absolute;
    right: 3vw;
    top: 75vw;
    width: 10vw;
  }

  .btn-prev {
    position: absolute;
    left: 3vw;
    top: 75vw;
    width: 10vw;
    transform: rotate(180deg);
  }

  .tri-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
  }
  .scene {
    .element {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .dialog-image-size {
    height: 50vh;
    margin-bottom: 0;
  }
  .dialog-set-background {
    .palettes {
      flex-wrap: wrap;
      display: flex;
      justify-content: center;
      .color {
        margin: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        width: 20vw;
        height: 20vw;
      }
    }
  }
}
</style>
