<template>
  <div id="xd">
    <top-bar :work="work"
      @insert-image="insertRawImage"
      @insert-shape="insertShape"
      @insert-text="insertText"
      @run="runWork"></top-bar>
    <transition name="slide-left">
      <left-toggle-menu v-if="showLeftToggleMenu" @menu-clicked="showLeftToggleMenu = false"></left-toggle-menu>
    </transition>
    <div class="scene-container" ref="sceneContainer">
      <div class="device" ref="device" v-if="currentScene" :style="currentScene.style" @click.self="sceneClick">
        <div v-for="(element, index) of currentScene.elements" :key="element.id" :id="'element-' + element.id"
             class="element" :class="[element.visible?'':'hidden', 'type' + element.type, multipleElements.indexOf(element) > -1? 'selected': '']" :style="element.style + ';' + 'z-index:' + index + ';'"
             @click="chooseElement(element, $event)">
          <!--图片渲染-->
          <img v-if="element.type === TypeEnum.IMAGE || element.type === TypeEnum.SVG" :src="element.url" :style="element.innerStyle || ''">
          <!--文本渲染情况下 文本内容-->
          <span v-if="element.type === TypeEnum.TEXT" v-html="element.text"></span>
          <!--文件被选中的遮罩-->
          <div class="mask" v-if="multipleElements.indexOf(element) > -1">
            <!--右下角corner-->
            <div class="corner-rb" v-if="multipleElements.length === 1 && element===currentElement"></div>
          </div>
        </div>
      </div>
      <div class="scene-options">
        <span class="tag is-info">{{work.scenes.indexOf(currentScene)+1}}/{{work.scenes.length}}</span>
        <a class="button is-small" @click="previousScene" style="margin-top: 5px;">
          向前
        </a>
        <a class="button is-small" @click="nextScene" style="margin-top: 5px;">
          向后
        </a>
        <a class="button is-success is-small" @click="addNewScene" style="margin-top: 5px;">新增</a>
      </div>
      <div class="mask-right" @click="sceneClick" :style="maskRightStyle"/>
      <div class="mask-bottom" :style="maskBottomStyle"/>
    </div>
    <div class="aside">
      <element-config :element="currentElement" :scene="currentScene" v-if="currentElement"></element-config>
      <work-scene-config :scene="currentScene" :work="work" v-if="!currentElement && currentScene.id"
        @choose-element="chooseElement"/>
    </div>
    <!-- float 切换显示 -->
    <image-cropper ref="cropper"></image-cropper>
    <dialog-edit-text ref="dialogEditText" @input="setElementText"/>
  </div>
</template>

<script>
import elementMixin from './mixins/elementMixins'
import saveShareMixin from './mixins/saveShare'
import sceneMixin from './mixins/sceneMixins'
import layoutMixin from './mixins/layoutMixin'
import keyBindMixin from './mixins/key-binds'
import initMixin from './mixins/init'

import ImageCropper from './components/ImageCropper'
import LeftToggleMenu from './components/LeftToggleMenu.vue'
import TopBar from './components/TopBar.vue'
import ElementConfig from './components/ElementConfig.vue'
import DialogEditText from './components/DialogEditText.vue'
import WorkSceneConfig from './components/WorkSceneConfig.vue'
import ToolBar from './components/ToolBar.vue'
import { TypeEnum } from '../danke-core/elements/index'
export default {
  name: 'Builder',
  components: {
    ToolBar,
    TopBar,
    ElementConfig,
    ImageCropper,
    LeftToggleMenu,
    WorkSceneConfig,
    DialogEditText
  },
  mixins: [initMixin, elementMixin, saveShareMixin, sceneMixin, keyBindMixin, layoutMixin],
  props: {
  },
  data () {
    return {
      // 作品概要信息
      work: {
        ratio: '',
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
      multipleElements: [],
      TypeEnum,
      showLeftToggleMenu: false,
      showElementsLayer: false,
      interactEnabled: true
    }
  },
  created () {
  },
  methods: {
    sceneClick () {
      this.hideLeftToggleMenu()
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
  .scene-container {
    position: absolute;
    left: 0;
    top: 40px;
    bottom: 0;
    right: 320px;
    overflow: auto;
    .scene-options {
      position: absolute;
      right: 0;
      display: flex;
      z-index: 202;
      flex-direction: column;
      top: 0;
      width: 40px;
      height: 300px;
    }
    .device {
      touch-action: none;
      position: absolute;
      background-color: #fff;
      border: 1px solid #ccc;
      overflow: hidden;
      z-index: 10;
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
        .mask {
          z-index: -1;
          position: absolute;
          left: -2px;
          top: -2px;
          width: calc(100% + 2px);
          height: calc(100% + 2px);
          border: 1px solid #87b1f1;
          box-sizing: content-box;
          .corner-rb {
            background-color: #87b1f1;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 10px;
            height: 10px;
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
