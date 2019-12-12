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
          <!--文件被选中的遮罩-->
          <div class="mask" v-if="currentElement" :style="maskStyle">
            <!--右下角corner-->
            <div class="corner-rb"></div>
          </div>
        </div>
        <el-button v-if="work.audioUrl" class="btn-audio" icon="el-icon-headset" size="mini" circle @click="editTicking"/>
      </div>
      <!--场景操作-->
      <span class="tag is-white">{{work.scenes.indexOf(currentScene)+1}}/{{work.scenes.length}}</span>
      <el-button class="btn-run" icon="el-icon-caret-right" size="mini" circle type="success" @click="runWork" />
      <el-button class="btn-next" icon="el-icon-arrow-right" size="mini" circle @click="nextScene" />
      <el-button class="btn-prev" icon="el-icon-arrow-left" size="mini" circle @click="previousScene" />
      <!--PopOver新增场景、元素-->
      <popover-new @insert="insert"/>
    </div>
    <div class="aside">
      <element-config
        v-if="currentElement"
        :element="currentElement"
        :scene="currentScene"
        :work="work"
        @remove="deleteElement"
        @z="moveElementZ" />
      <work-scene-config
        v-if="!currentElement && currentScene && currentScene.id"
        :scene="currentScene"
        :work="work"
        @choose-element="chooseElement"
        @choose-scene="chooseScene"
        @edit-tick="editTicking"
        @delete-scene="deleteCurrentScene"/>
    </div>
    <dialog-audio-tap ref="dialogAudioList" @audio="chooseWorkAudio"/>
    <dialog-choose-flat-icon ref="dialogChooseFlatIcon" @input="flatIconChoosed"/>
  </div>
</template>

<script>
import elementMixin from './mixins/elementMixins'
import saveShareMixin from './mixins/saveShare'
import sceneMixin from './mixins/sceneMixins'
import layoutMixin from './mixins/layoutMixin'
import keyBindMixin from './mixins/key-binds'
import { Popover, Button, Upload, Tabs, TabPane, Drawer, Dialog } from 'element-ui'
import ElementConfig from './components/ElementConfig.vue'
import DialogAudioTap from './components/DialogAudioTap.vue'
import WorkSceneConfig from './components/WorkSceneConfig.vue'
import { TypeEnum } from '../danke-core/elements/index'
import RenderElement from './RenderElement.vue'
import { addStyle, createSheet } from '../frames/keyframe'
import PopoverNew from './components/PopoverNew.vue'
import DialogChooseFlatIcon from '../flaticon/DialogChooseFlatIcon'
import BackGround from '../danke-core/css-model/background'

import 'element-ui/packages/theme-chalk/lib/icon.css'
export default {
  name: 'Builder',
  components: {
    DialogChooseFlatIcon,
    RenderElement,
    ElementConfig,
    WorkSceneConfig,
    DialogAudioTap,
    PopoverNew,
    [Popover.name]: Popover,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Upload.name]: Upload,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Drawer.name]: Drawer
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
        resources: [], // 作品引用的公共资源
        animations: [], // 作品使用的动画
        scenes: [], // 场景列表
        background: JSON.parse(JSON.stringify(BackGround)),
        styles: '' // 附加的样式
      },
      currentScene: null,
      currentElement: null,
      multipleElements: [],
      TypeEnum,
      showLeftToggleMenu: false,
      showElementsLayer: false,
      interactEnabled: true,
      ticksEditing: false,
      templates: null // 已经加载的模板
    }
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
      this.chooseElement(null)
    },
    chooseWorkAudio (audioItem) {
      this.work.audioUrl = audioItem.audioUrl
      this.work.audioName = audioItem.name
      this.work.audioTicks = audioItem.ticks
    },

    flatIconChoosed (icon) {
      this.insertSVGImage(icon.svg, icon.desc)
    },
    // 显示Icon栏
    showFlatIconPopover () {
      this.$refs.dialogChooseFlatIcon.open()
    },
    openAudioDialog () {
      this.$refs.dialogAudioList.open()
    },

    /**
     * 响应popup 插入相关场景、元素等
     * @param type
     * @param data
     */
    insert (type, data) {
      switch (type) {
        case 'scene':
          this.addNewScene()
          break
        case 'clone-scene':
          this.cloneScene()
          break
        case 'image':
          this.insertRawImage(data)
          break
        case 'svg':
          this.insertSVGImage(data.svg, data.desc)
          break
        case 'back-audio':
          this.openAudioDialog()
          break
        case 'text':
          this.insertText()
          break
        case 'shape':
          this.insertShape()
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
html.has-navbar-fixed-top, body.has-navbar-fixed-top {
  padding-top: 0;
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
      z-index: 999;
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    .btn-run {
      position: absolute;
      right: 10px;
      top: 10px;
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
      left: 10px;
      top: 10px;
      z-index: 999;
    }
    .device {
      touch-action: none;
      position: absolute;
      border: 1px solid #eee;
      border-radius: 10px;
      z-index: 10;
      overflow: hidden;
      perspective: 500px;
      .btn-audio {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 9999;
      }

      .mask {
        z-index: 999;
        border: 2px dashed #87b1f1;
        box-sizing: border-box;
        .corner-rb {
          display: none;
          background-color: #87b1f1;
          position: absolute;
          right: 0;
          bottom: 0;
          width: 10px;
          height: 10px;
        }
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

@media screen and (max-width: 1080px) {
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
