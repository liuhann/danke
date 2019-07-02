<template>
  <div id="xd">
    <toolbar></toolbar>
    <left-menubar></left-menubar>
    <div class="scene-container" ref="container">
      <div class="device-drag" ref="deviceDrag"></div>
      <div class="device" ref="device" :style="deviceStyle" @click.self="sceneClick">
        <div v-for="element of elements" :key="element.id" :id="'element-' + element.id"
             class="element" :class="[element.visible?'':'hidden']" :style="element.style"
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
    <nav class="panel element-prop-config is-small" v-if="currentElement">
      <p class="panel-heading">
        元素配置
      </p>
      <div class="panel-block">
        <prop-config :element="currentElement"></prop-config>
      </div>
    </nav>
    <transition name="slide-left">
      <left-toggle-menu v-if="showLeftToggleMenu" @menu-clicked="showLeftToggleMenu = false" @command="executeCommand"></left-toggle-menu>
    </transition>
    <element-list-config v-show="showElementsLayer" :elements="elements" @choose="chooseElement" @ordered="resetOrder"></element-list-config>
    <image-cropper ref="cropper"></image-cropper>
  </div>
</template>

<script>
import elementMixin from './mixins/elementMixins'
import saveShareMixin from './mixins/saveShare'
import { fitToContainer } from '../danke-core/utils/common'
import { intereactWith } from './utils/interact'
import { TypeEnum } from '../danke-core/elements/index'
import ImageCropper from './components/ImageCropper'
import LeftToggleMenu from './components/LeftToggleMenu'
import Toolbar from './components/Toolbar'
import LeftMenubar from './components/LeftMenubar'
import PropConfig from './components/PropConfig'
import ElementListConfig from './components/ElementListConfig'
import { renderSceneStage } from '../danke-core/utils/styles'
export default {
  name: 'Builder',
  components: { ElementListConfig, PropConfig, ImageCropper, LeftToggleMenu, Toolbar, LeftMenubar },
  mixins: [ elementMixin, saveShareMixin ],
  props: {
    ratio: {
      type: String,
      default: '9:16'
    }
  },
  data () {
    return {
      sceneName: '我的作品-1',
      scenes: [],
      resources: {},
      sceneId: null,
      TypeEnum,
      elements: [],
      currentElement: null,
      deviceOrigin: {
        width: 360,
        height: 640
      },
      zoom: 1,
      showLeftToggleMenu: false,
      showElementsLayer: false
    }
  },
  provide () {
    return {
      sceneName: this.sceneName,
      showLeftToggleMenu: this.showLeftToggleMenu,
      showElementsLayer: this.showElementsLayer,
      elements: this.elements,
      currentElement: this.currentElement,
      zoom: this.zoom,
      // provide methods
      runPreview: this.runPreview,
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
  mounted () {
    this.zoomCenter()
    intereactWith(this.$refs.deviceDrag, this.$refs.device)
  },
  methods: {
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
      console.log('reordered')
      this.elements = elements
    },
    async runPreview () {
      this.zoomCenter()
      await renderSceneStage({
        elements: this.elements
      }, this.device, 'in')
      renderSceneStage({
        elements: this.elements
      }, this.device, 'dura')
    },
    executeCommand (cmd) {
      switch (cmd) {
        case 'save':
          this.savePage()
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
#xd {
  @import './common.scss';
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f4;

  .element-prop-config, .element-list-config {
    position: absolute;
    z-index: 11;
    top: 2.5em;
    background-color: #fff;
    width: 320px;
  }
  .element-prop-config {
    right: 0;
  }
  .element-list-config {
    left: 3.2em;
    width: 280px;
    bottom: 0;
  }
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
      transition: transform .2s linear;
      .element {
        position: absolute;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
