<template>
  <div id="xd">
    <top-bar></top-bar>
    <tool-bar></tool-bar>
    <transition name="slide-left">
      <left-toggle-menu v-if="showLeftToggleMenu" @menu-clicked="showLeftToggleMenu = false"></left-toggle-menu>
    </transition>
    <div class="scene-container" ref="sceneContainer">
      <div class="device-drag" ref="deviceDrag" @click="sceneClick"></div>
      <div class="device" ref="device" v-if="currentScene" :style="currentScene.style" @click.self="sceneClick">
        <div v-for="(element, index) of currentScene.elements" :key="element.id" :id="'element-' + element.id"
             class="element" :class="[element.visible?'':'hidden', 'type' + element.type]" :style="element.style + ';' + 'z-index:' + index + ';'"
             @click="choose(element, $event)">
          <img v-if="element.type === TypeEnum.IMAGE" :src="element.url">
          <span v-if="element.type === TypeEnum.TEXT && element!==currentElement" v-html="$options.filters.newline(element.text)"></span>
          <div class="mask" v-if="multipleElements.indexOf(element) > -1">
            <span @input="contentChange" contenteditable v-if="element.type === TypeEnum.TEXT && multipleElements.length === 1" v-html="$options.filters.newline(element.text)"></span>
            <div class="corner-rb" v-if="multipleElements.length === 1 && element===currentElement"></div>
          </div>
        </div>
        <div class="scene-options">
          <span class="tag is-info">{{scenes.indexOf(currentScene)+1}}/{{scenes.length}}</span>
          <a class="button is-small" @click="previousScene" style="margin-top: 5px;">
            向前
          </a>
          <a class="button is-small" @click="nextScene" style="margin-top: 5px;">
            向后
          </a>
          <a class="button is-success is-small" @click="addNewScene" style="margin-top: 5px;">新增</a>
        </div>
      </div>
    </div>
    <div class="aside">
      <element-config :element="currentElement" v-if="currentElement"></element-config>
      <scene-config :scene="currentScene" v-if="!currentElement && currentScene"></scene-config>
    </div>
    <!-- float 切换显示 -->
    <list-config v-if="currentScene" v-show="showElementsLayer"
      @go-scene-list="goToSceneList"
      @choose-scene="chooseScene"
      @ordered="resetOrder"></list-config>
    <image-cropper ref="cropper"></image-cropper>
    <dialog-work-list ref="dialogWorkList" @choose="openWork"></dialog-work-list>
    <dialog-edit-work ref="dialogEditWork" @save="saveWorkDesc"></dialog-edit-work>
    <full-player v-if="playing" :ratio="playingWork.ratio" :work="playingWork"></full-player>
  </div>
</template>

<script>
import elementMixin from './mixins/elementMixins'
import saveShareMixin from './mixins/saveShare'
import sceneMixin from './mixins/sceneMixins'
import sceneContainer from './mixins/sceneContainer'
import keyBindMixin from './mixins/key-binds'
import { TypeEnum } from '../danke-core/elements/index'
import ImageCropper from './components/ImageCropper'
import LeftToggleMenu from './components/LeftToggleMenu.vue'
import TopBar from './components/TopBar.vue'
import ElementConfig from './components/ElementConfig.vue'
import ListConfig from './components/ListConfig.vue'
import SceneConfig from './components/SceneConfig.vue'
import FullPlayer from './components/FullPlayer.vue'
import DialogWorkList from './components/DialogWorkList.vue'
import DialogEditWork from './components/DialogEditWork'
import ToolBar from './components/ToolBar.vue'
export default {
  name: 'Builder',
  components: {
    ToolBar,
    TopBar,
    DialogEditWork,
    ListConfig,
    ElementConfig,
    ImageCropper,
    LeftToggleMenu,
    SceneConfig,
    FullPlayer,
    DialogWorkList
  },
  mixins: [elementMixin, saveShareMixin, sceneMixin, keyBindMixin, sceneContainer],
  props: {
  },
  data () {
    return {
      showWelcome: true,
      work: {
        ratio: '',
        id: '',
        title: '',
        categories: [],
        desc: ''
      },
      playingWork: null,
      scenes: [],
      currentScene: null,
      resources: {},
      currentElement: null,
      multipleElements: [],
      TypeEnum,
      showLeftToggleMenu: false,
      showElementsLayer: false,
      playing: false
    }
  },
  provide () {
    return {
      scenes: this.scenes,
      showElementsLayer: this.showElementsLayer,
      multipleElements: this.multipleElements,
      currentScene: this.currentScene,
      // provide methods
      hideLeftToggleMenu: this.hideLeftToggleMenu,
      stopWork: this.stopWork,
      runWork: this.runWork,
      sceneClick: this.sceneClick,
      zoomIn () {
        this.$refs.sceneContainer.zoomIn()
      },
      zoomOut () {
        this.$refs.sceneContainer.zoomOut()
      }
    }
  },
  created () {
  },
  mounted () {
    const work = this.$route.query.work
    const ratio = this.$route.query.ratio
    if (work === 'new') {
      this.newWork(ratio)
    } else {
      this.fetchWork(work)
    }
  },
  methods: {
    hideLeftToggleMenu () {
      this.showLeftToggleMenu = false
    },
    sceneClick () {
      this.hideLeftToggleMenu()
      this.chooseElement(null)
    },
    resetOrder (elements) {
      this.currentScene.elements = elements
    },
    async runWork () {
      this.playingWork = this.getWorkConfig()
      this.playing = true
    },

    async stopWork () {
      this.playing = false
    },
    chooseScene (scene) {
      this.chooseElement(null)
      this.currentScene = scene
    },
    goToSceneList () {
      this.chooseElement(null)
    }
  }
}
</script>

<style lang="scss">
html.has-navbar-fixed-top, body.has-navbar-fixed-top {
  padding-top: 0;
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
  .tool-bar {
    position: absolute;
    z-index: 101;
    top: 40px;
    width: 48px;
    left: 0;
    bottom: 0;
  }
  .top-bar {
    height: 38px;
  }
  .scene-container {
    position: absolute;
    left: 48px;
    top: 40px;
    bottom: 0;
    right: 320px;
    overflow: auto;

    .device-drag {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
    }
    .device {
      touch-action: none;
      position: absolute;
      left: 20px;
      background-color: #fff;
      z-index: 10;
      .element {
        position: absolute;
        &.type1 {
          display: flex;
          justify-content: center;
          align-items: center;
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
        .mask {
          position: absolute;
          left: -2px;
          top: -2px;
          width: calc(100% + 2px);
          height: calc(100% + 2px);
          border: 1px solid #87b1f1;
          box-sizing: content-box;
          span {
            outline:none;
          }
          .corner-rb {
            background-color: #87b1f1;
            position: absolute;
            right: -6px;
            bottom: -6px;
            width: 12px;
            height: 12px;
          }
        }
      }
      .scene-options {
        position: absolute;
        right: -42px;
        display: flex;
        flex-direction: column;
        top: 0;
        width: 40px;
        height: 300px;
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
    top: 40px;
    width: 320px;
    bottom: 0;
    background-color: #fff;
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
