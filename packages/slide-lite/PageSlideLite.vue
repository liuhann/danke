<template>
<div class="slide-lite">
  <div class="device-container" :style="containerStyle">
    <div class="scene" :style="currentScene.style">
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
    <img src="./arrow-btn.png" @click="nextScene">
  </div>
  <div class="btn-prev" @click="prevScene">
    <img src="./arrow-btn.png">
  </div>
  <div class="tri-button columns is-mobile is-centered">
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
    <div class="column is-narrow">
      <a class="button is-info" @click="runWork">运行</a>
    </div>
  </div>

  <!--  操作图片的对话框-->
  <el-dialog :visible.sync="elementMenuDialog" title="设置图片" width="75%" top="30vh" custom-class="dialog-edit-menu">
    <a class="button is-medium is-fullwidth" @click="setImageSize">位置及大小</a>
    <a class="button is-medium is-fullwidth" @click="chooseAnimation">动画</a>
    <a class="button is-medium is-fullwidth">滤镜效果</a>
  </el-dialog>
  <el-dialog :visible.sync="chooseSizeDialog" title="设置图片位置和大小" width="100%" top="50vh" custom-class="dialog-image-size">
    <div class="fix-appearances">
      <div v-for="(appearance, index) in fixAppearances" :key="index" class="appearance" @click="setElementAppearance(appearance)">
        {{appearance.label}}
      </div>
    </div>
  </el-dialog>
  <dialog-audio-tap :setName="false" audioPath="tickAudio" :fullscreen="true" ref="dialogAudioList" @audio="chooseAudio"></dialog-audio-tap>
  <model-choose-frame ref="dialogFrameChoose" :element="currentElement"></model-choose-frame>
</div>
</template>

<script>
import { Dialog, Message, Loading } from 'element-ui'
import { clone } from '../utils/object'
import { getElementStyle, getSceneStyle, getImageWebUrl, getLenSplits } from '../danke-core/utils/styles'
import { shortid } from '../utils/string'
import { TypeEnum, IMAGE } from '../danke-core/elements'
import SCENE from '../danke-core/elements/scene'
import DialogAudioTap from '../xd-builder/components/DialogAudioTap.vue'
import ModelChooseFrame from '../frames/ModelChooseFrame.vue'
import ImageDAO from '../common/dao/imagedao'
import getImageSize from '../common/utils/getImageSize'
import RestDAO from '../common/dao/restdao'

export default {
  components: { DialogAudioTap, [Dialog.name]: Dialog, ModelChooseFrame },
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
      chooseSizeDialog: false,
      elementMenuDialog: false
    }
  },
  computed: {
    containerStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    },
    fixAppearances () {
      return [{
        label: '正中横向全屏,高度自适应',
        horizontal: 'center',
        vertical: 'center',
        width: '100vw',
        height: 'auto',
        left: 0,
        top: 0
      }, {
        label: '正中横向全屏,正方形裁剪',
        horizontal: 'center',
        vertical: 'center',
        width: '100vw',
        height: '100vw',
        left: 0,
        top: 0
      }, {
        label: '自适应全屏显示',
        horizontal: 'center',
        vertical: 'center',
        width: '100vw',
        height: '100vh',
        left: 0,
        top: 0
      }]
    }
  },

  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.work.id = shortid()
    this.addNewScene()
    this.currentSceneIndex = 0
    this.chooseScene()
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
    chooseAudio (audioItem) {
      this.work.audioUrl = audioItem.audioUrl
      this.work.audioName = audioItem.name
      this.work.duration = audioItem.dura
      this.work.audioTicks = audioItem.ticks
      this.applyWorkTicksToScenes()
    },
    chooseAnimation () {
      this.$refs.dialogFrameChoose.chooseFrame('in')
      this.elementMenuDialog = false
    },
    /**
     * 增加新的空白场景
     */
    addNewScene () {
      const scene = clone(SCENE)
      scene.background.color = ['#f0f8ff']
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
      if (this.currentSceneIndex === this.work.scenes.length - 1) {
        this.addNewScene()
      }
      this.currentSceneIndex ++
      this.chooseScene()
    },
    prevScene () {
      if (this.currentSceneIndex > 0) {
        this.currentSceneIndex --
        this.chooseScene()
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
      if (this.work.scenes.length < this.work.audioTicks.length ) {
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
          message: '注意:您有' + (this.work.scenes.length - this.work.audioTicks.length ) + '张图片没有默认节拍'
        })
      }
    },
    newline (val) {
      return val.replace(/\n/g, '<br>')
    },
    chooseElement (element, event) {
      this.currentElement = element
      this.elementMenuDialog = true
    },
    async imageChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        const loading = Loading.service({
          lock: true,
          text: '正在保存图片',
          fullscreen: true,
          background: 'rgba(255, 255, 255, 0.6)'
        })
        const size = await getImageSize(file)
        const result = await this.imagedao.uploadBlob(file, this.work.id)
        this.insertRawImage(result.name, size, file)
        loading.close()
      }
    },

    /**
     * 设置图片的大小及位置
     */
    setImageSize () {
      this.chooseSizeDialog = true
      this.elementMenuDialog = false
    },
    setElementAppearance (appearance) {
      if (this.currentElement) {
        this.currentElement.position.horizontal = appearance.horizontal
        this.currentElement.position.vertical = appearance.vertical
        this.currentElement.size.width = appearance.width
        this.currentElement.size.left = appearance.left
        this.currentElement.size.top = appearance.top
        if (appearance.height === 'auto') {
          this.currentElement.size.height = ((this.currentElement.oheight / this.currentElement.owidth) *
            getLenSplits(appearance.width).len) + 'vw'
        } else {
          this.currentElement.size.height = appearance.height
        }
        // this.currentElement.url = getImageWebUrl(this.currentElement, this.device)
        const style = getElementStyle(this.currentElement, this.device)
        this.currentElement.style = style
      }
    },

    /**
     * 给当前画面插入新的图片
     **/
    insertRawImage: function (url, size, file) {
      const clonedElement = clone(IMAGE)
      clonedElement.id = shortid()
      clonedElement.name = '图片'
      clonedElement.visible = true
      clonedElement.border.width = 0
      clonedElement.owidth = size.width
      clonedElement.oheight = size.height
      clonedElement.imgPath = url
      // 这里还是使用本地地址
      clonedElement.url = URL.createObjectURL(file)
      this.currentScene.elements.push(clonedElement)
      this.currentElement = clonedElement
      this.setElementAppearance(this.fixAppearances[0])
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
  .fix-appearances {
    .appearance {
      padding: 10px 20px;
      border-bottom: 1px solid #efefef;
    }
  }
}
</style>
