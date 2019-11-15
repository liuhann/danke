<template>
  <div id="xd">
    <top-bar
      @insert-image="insertRawImage"
      @insert-shape="insertShape"
      @insert-text="insertText"
      @crop="cropImage"
      @run="runWork"></top-bar>
    <div class="scene-container" ref="sceneContainer">
      <div class="device" ref="device" v-if="currentScene" :style="currentScene.style" @click.self="sceneClick">
        <render-element
          v-for="(element, index) of currentScene.elements"
          :element="element"
          :key="element.id"
          :index="index"
          :selected="currentElement === element"
          @click="chooseElement(element, $event)"/>
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
      <element-config :element="currentElement" :scene="currentScene" v-if="currentElement" :work="work" @remove="deleteElement"></element-config>
      <work-scene-config :scene="currentScene" :work="work" v-if="!currentElement && currentScene.id"
        @choose-element="chooseElement" @choose-scene="chooseScene" @edit-tick="editTicking" @delete-scene="deleteCurrentScene"/>
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

import ImageCropper from './components/ImageCropper'
import TopBar from './components/TopBar.vue'
import ElementConfig from './components/ElementConfig.vue'
import DialogEditText from './components/DialogEditText.vue'
import WorkSceneConfig from './components/WorkSceneConfig.vue'
import { TypeEnum } from '../danke-core/elements/index'
import RenderElement from './RenderElement.vue'
import ImageDAO from '../common/dao/imagedao'
import RestDAO from '../common/dao/restdao'
export default {
  name: 'Builder',
  components: {
    RenderElement,
    TopBar,
    ElementConfig,
    ImageCropper,
    WorkSceneConfig,
    DialogEditText
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
      interactEnabled: true,
      ticksEditing: false
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    const workId = this.$route.query.work
    const ratio = this.$route.query.ratio
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
          z-index: 1;
          position: absolute;
          left: 0;
          top: 0;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
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
