<template>
  <div id="xd">
    <toolbar></toolbar>
    <left-menubar></left-menubar>
    <div class="scene-container" ref="container">
      <div class="device-drag" ref="deviceDrag"></div>
      <div class="device" v-if="currentScene" ref="device" :style="currentScene.style" @click.self="sceneClick">
        <div v-for="(element, index) of currentScene.elements" :key="element.id" :id="'element-' + element.id"
             class="element" :class="[element.visible?'':'hidden']" :style="element.style + ';' + 'z-index:' + index + ';'"
             @click="chooseElement(element)">
          <img v-if="element.type === TypeEnum.IMAGE" :src="element.url">
          <span v-if="element.type === TypeEnum.TEXT && element!==currentElement" v-html="$options.filters.newline(element.text)"></span>
          <div class="mask" v-if="element===currentElement">
            <span @input="contentChange" contenteditable v-if="element.type === TypeEnum.TEXT" v-html="$options.filters.newline(element.text)"></span>
            <div class="corner-rb"></div>
          </div>
        </div>
      </div>
    </div>
    <prop-config :element="currentElement" v-if="currentElement"></prop-config>
    <scene-config :scene="currentScene" v-if="!currentElement"></scene-config>
    <transition name="slide-left">
      <left-toggle-menu v-if="showLeftToggleMenu" @menu-clicked="showLeftToggleMenu = false"></left-toggle-menu>
    </transition>
    <list-config v-if="currentScene" v-show="showElementsLayer"
      :scenes="scenes"
      :current-element="currentElement"
      :current-scene="currentScene"
      @go-scene-list="goToSceneList"
      @choose-scene="chooseScene"
      @ordered="resetOrder"></list-config>
    <image-cropper ref="cropper"></image-cropper>
    <dialog-work-list ref="dialogWorkList"></dialog-work-list>
    <full-player v-if="playing" :ratio="ratio" :work="work"></full-player>
  </div>
</template>

<script>
import elementMixin from './mixins/elementMixins'
import saveShareMixin from './mixins/saveShare'
import sceneMixin from './mixins/sceneMixins'
import { fitToContainer } from '../danke-core/utils/common'
import { intereactWith } from './utils/interact'
import { TypeEnum } from '../danke-core/elements/index'
import ImageCropper from './components/ImageCropper'
import LeftToggleMenu from './components/LeftToggleMenu.vue'
import Toolbar from './components/Toolbar.vue'
import LeftMenubar from './components/LeftMenubar.vue'
import PropConfig from './components/PropConfig.vue'
import ListConfig from './components/ListConfig.vue'
import SceneConfig from './components/SceneConfig.vue'
import FullPlayer from './components/FullPlayer.vue'
import DialogWorkList from './components/DialogWorkList.vue'
import { renderSceneStage, getSceneStyle } from '../danke-core/utils/styles'
import { shortid } from '../utils/string'
export default {
  name: 'Builder',
  components: { ListConfig, PropConfig, ImageCropper, LeftToggleMenu, Toolbar, LeftMenubar, SceneConfig, FullPlayer, DialogWorkList },
  mixins: [ elementMixin, saveShareMixin, sceneMixin ],
  props: {
    ratio: {
      type: String,
      default: '9:16'
    }
  },
  data () {
    return {
      work: {
        id: '',
        title: '',
        categories: '',
        desc: '',
      },
      scenes: [],
      currentScene: {},
      resources: {},
      currentElement: null,
      TypeEnum,
      deviceOrigin: {
        width: 360,
        height: 640
      },
      zoom: 1,
      showLeftToggleMenu: false,
      showElementsLayer: false,
      playing: false
    }
  },
  provide () {
    return {
      scenes: this.scenes,
      showLeftToggleMenu: this.showLeftToggleMenu,
      showElementsLayer: this.showElementsLayer,
      zoom: this.zoom,
      // provide methods
      stopWork: this.stopWork,
      runWork: this.runWork,
      zoomIn: this.zoomIn,
      zoomOut: this.zoomOut
    }
  },
  computed: {
    device () {
      return {
        width: this.deviceOrigin.width * this.zoom,
        height: this.deviceOrigin.height * this.zoom
      }
    },
    deviceStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },
  created () {
    this.newWork()
  },
  mounted () {
    this.zoomCenter()
    intereactWith(this.$refs.deviceDrag, this.$refs.device)
  },
  methods: {
    newWork () {
      this.work.id = shortid()
      this.work.title = '我的作品'
      this.addNewScene()
    },
    zoomIn () {
      this.zoom = Math.floor((this.zoom - 0.1) * 10) / 10
      this.reflow()
    },
    zoomOut () {
      this.zoom = Math.floor((this.zoom + 0.1) * 10) / 10
      this.reflow()
    },
    zoomCenter () {
      const containerEl = this.$refs.container
      const paddings = [20, 20]
      this.zoom = 1
      this.deviceOrigin = fitToContainer(this.ratio, containerEl.clientWidth - paddings[0] * 2, containerEl.clientHeight - paddings[1] * 2)
      this.$nextTick(() => {
        let x = (containerEl.clientWidth - paddings[0] * 2 - this.deviceOrigin.width) / 2
        let y = paddings[1]
        this.$refs.device.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
      })
    },
    sceneClick () {
      this.chooseElement(null)
    },
    resetOrder (elements) {
      this.currentScene.elements = elements
    },
    async runWork () {
      this.work = {
        scenes: JSON.parse(JSON.stringify(this.scenes))
      }
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

  .scene-container {
    position: absolute;
    left: 0;
    font-size: 0.75rem;
    top: 3em;
    bottom: 0;
    right: 0;
    overflow: hidden;
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
      .ti {
        position: absolute;
        background-color: #0a0a0a;
        left: -30px;
        width: 30px;
        height: 30px;
      }
    }
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
