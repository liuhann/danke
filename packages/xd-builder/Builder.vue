<template>
  <div id="xd">
    <div class="scene-container" ref="sceneContainer" @click.self="sceneClick">
      <!--渲染当前的场景-->
      <div class="device" ref="device" :style="deviceStyle">
        <div class="screen" v-if="currentScene" :style="currentScene.style" @click.self="sceneClick">
          <render-element
            v-for="(element, index) of currentScene.elements"
            stage="in"
            :element="element"
            :key="element.id"
            :index="index"
            :selected="currentElement === element"
            @click="chooseElement(element, $event)"/>
        </div>
        <el-button v-if="work.audioUrl" class="btn-audio" icon="el-icon-headset" size="mini" circle @click="editTicking"/>
      </div>
      <!--场景操作-->
      <span class="tag is-white">{{work.scenes.indexOf(currentScene)+1}}/{{work.scenes.length}}</span>
      <el-button class="btn-run" icon="el-icon-caret-right" size="mini" circle type="success" @click="runWork"/>
      <el-button class="btn-next" icon="el-icon-arrow-right" size="mini" circle @click="nextScene"/>
      <el-button class="btn-prev" icon="el-icon-arrow-left" size="mini" circle @click="previousScene"/>
      <!--PopOver新增场景、元素-->
      <el-popover
        placement="left-start"
        width="240"
        trigger="click">
        <div class="ptb-10">场景</div>
        <el-button icon="el-icon-document-add" style="font-size: 16px;" size="mini" circle @click="addNewScene"/>
        <el-button icon="el-icon-document-copy" style="font-size: 16px;" size="mini" circle @click="cloneScene"/>
        <div class="ptb-10">基本元素</div>
        <el-upload
          style="float: left; margin-right: 10px;"
          :show-file-list="false"
          :auto-upload="false"
          action="nothing"
          :on-change="insertRawImage">
          <el-button icon="el-icon-picture-outline" style="font-size: 16px;" size="mini" circle />
        </el-upload>
        <el-button icon="el-icon-files" size="mini" circle @click="insertShape('rect')"/>
        <el-button icon="el-icon-postcard" size="mini" circle @click="insertText"/>
        <el-button icon="el-icon-headset" size="mini" circle @click="openAudioDialog"/>
        <div class="ptb-10">插件</div>
        <el-upload
          style="float: left; margin-right: 10px;"
          :show-file-list="false"
          :auto-upload="false"
          action="nothing"
          :on-change="insertPaperFolding">
          <el-button icon="el-icon-s-grid" size="mini" circle/>
        </el-upload>
        <el-button class="btn-add" icon="el-icon-plus" slot="reference" type="primary" size="mini" circle/>
      </el-popover>
    </div>
    <div class="aside">
      <element-config :element="currentElement" :scene="currentScene" v-if="currentElement" :work="work" @remove="deleteElement"></element-config>
      <work-scene-config :scene="currentScene" :work="work" v-if="!currentElement && currentScene && currentScene.id"
        @choose-element="chooseElement" @choose-scene="chooseScene" @edit-tick="editTicking" @delete-scene="deleteCurrentScene"/>
    </div>
    <!-- float 切换显示 -->
    <image-cropper ref="cropper"></image-cropper>
    <dialog-edit-text ref="dialogEditText" @input="setElementText"/>
    <dialog-audio-tap ref="dialogAudioList" @audio="chooseAudio"/>
  </div>
</template>

<script>
import elementMixin from './mixins/elementMixins'
import saveShareMixin from './mixins/saveShare'
import sceneMixin from './mixins/sceneMixins'
import layoutMixin from './mixins/layoutMixin'
import keyBindMixin from './mixins/key-binds'
import { Popover, Button, Upload } from 'element-ui'
import ImageCropper from './components/ImageCropper'
import ElementConfig from './components/ElementConfig.vue'
import DialogEditText from './components/DialogEditText.vue'
import DialogAudioTap from './components/DialogAudioTap.vue'
import WorkSceneConfig from './components/WorkSceneConfig.vue'
import { TypeEnum } from '../danke-core/elements/index'
import RenderElement from './RenderElement.vue'
import ImageDAO from '../common/dao/imagedao'
import RestDAO from '../common/dao/restdao'
import { addStyle, createSheet } from '../frames/keyframe'

import 'element-ui/packages/theme-chalk/lib/icon.css'
export default {
  name: 'Builder',
  components: {
    RenderElement,
    ElementConfig,
    ImageCropper,
    WorkSceneConfig,
    DialogEditText,
    DialogAudioTap,
    [Popover.name]: Popover,
    [Button.name]: Button,
    [Upload.name]: Upload
  },
  mixins: [elementMixin, saveShareMixin, sceneMixin, keyBindMixin, layoutMixin],
  props: {
  },
  data () {
    return {
      // 作品概要信息
      work: {
        ratio: '',
        id: '',
        title: '',
        audioUrl: '', // 音频播放的地址
        audioName: '', // 音频名称（只用于显示）
        audioTicks: [], // 音频切换的节拍
        duration: 0, // 持续时间
        resources: [],
        scenes: [],
        styles: '' // 附加的样式
      },
      currentScene: null,
      currentElement: null,
      multipleElements: [],
      TypeEnum,
      showLeftToggleMenu: false,
      showElementsLayer: false,
      interactEnabled: true,
      ticksEditing: false
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },

  watch: {
    'work.styles': function () {
      const styleTag = document.getElementById('work-extra-style')
      if (styleTag) {
        styleTag.parentElement.removeChild(styleTag)
      }
      const sheet = createSheet('work-extra-style')
      try {
        const rules = this.work.styles.split('\n\n')
        for (let rule of rules) {
          addStyle(sheet, rule)
        }
      } catch (e) {
      }
    }
  },
  mounted () {
    let workId = this.$route.query.work || 'new'
    let ratio = this.$route.query.ratio || '9:16'
    if (workId === 'new') {
      this.newWork(ratio)
    } else {
      this.fetchWork(workId)
    }
  },
  methods: {
    async fetchWork (workId) {
      const work = await this.workdao.getOne(workId)
      this.openWork(work)
      this.chooseScene(this.work.scenes[0])
      this.renderScene(this.currentScene, 'in')
    },
    sceneClick () {
      this.hideLeftToggleMenu()
      this.chooseElement(null)
    },
    chooseAudio (audioItem) {
      this.work.audioUrl = audioItem.audioUrl
      this.work.audioName = audioItem.name
      this.work.audioTicks = audioItem.ticks
    },
    openAudioDialog () {
      this.$refs.dialogAudioList.open()
    }
  }
}
</script>

<style lang="scss">
html.has-navbar-fixed-top, body.has-navbar-fixed-top {
  padding-top: 0;
}

.el-button {
 font-size: 16px;
}

.ptb-10 {
  padding-bottom: 10px;
  padding-top: 10px;
}
#xd {
  @import './common.scss';
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f4;
  .scene-container {
    position: absolute;
    left: 0;
    top: 5px;
    bottom: 5px;
    right: 320px;
    overflow: auto;
    .tag {
      z-index: 9999;
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    .btn-run {
      position: absolute;
      right: 10px;
      top: 60px;
      z-index: 999;
    }
    .btn-next {
      position: absolute;
      right: 10px;
      top: calc(50% - 10px);
      z-index: 999;
    }
    .btn-prev {
      position: absolute;
      left: 10px;
      top: calc(50% - 10px);
      z-index: 999;
    }
    .btn-add {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 999;
    }
    .device {
      touch-action: none;
      position: absolute;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==");
      border: 1px solid #eee;
      border-radius: 10px;
      overflow: hidden;
      z-index: 10;
      .btn-audio {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 9999;
      }
      .element {
        position: absolute;
        overflow: hidden;
        &.selected {
          overflow: visible;
        }
        &.type1 {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &.type2 {
          display: flex;
          align-items: center;
          span {
            width: 100%;
          }
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &.hidden {
          display: none;
        }
        &.current {
          outline: 2px dashed #87b1f1;
          outline-offset: 0;
          z-index: 9999;
        }
        span.content-editable {
          outline:none;
          -webkit-user-modify: read-write-plaintext-only;
        }
      }

      .ti {
        position: absolute;
        background-color: #0a0a0a;
        left: -30px;
        width: 30px;
        height: 30px;
      }
    }
  }
  .welcome {
    position: absolute;
    left: 48px;
    top: 40px;
    bottom: 0;
    right: 0;
    overflow: auto;
  }
  .aside {
    position: absolute;
    right: 0;
    top: 5px;
    width: 320px;
    bottom: 0;
    background-color: #fff;
  }
}

@media screen and (max-width: 1200px) {
  #xd .scene-container {
    top: 0;
    bottom: 0;
    right: 0;
  }
}

.line {
  margin: 5px 0;
  height: 4px;
  background: repeating-linear-gradient(to right, red 0, red 5px, transparent 5px, transparent 7px);
  /*5px red then 2px transparent -> repeat this!*/
  background-size: 100% 1px;
  background-repeat: no-repeat;
}

.slide-left-enter-active, .slide-left-leave-active {
transition: transform .2s ease-out;
}
.slide-left-enter, .slide-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
transform: translateX(-100%)
}
</style>
