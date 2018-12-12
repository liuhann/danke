<template>
<div class="designer mobile">
  <van-icon name="add" v-tap.stop="tapAddElement"/>

  <div class="scene-wrapper" :class="[isFullScreen? '': 'preview']" :style="{height: device.height + 'px', width: device.width + 'px'}" v-hold="longHoldPlace" v-tap="tapPlace">
      <scene v-if="currentScene" :scene="currentScene" :device="device" @element-selected="tapElementEdit"></scene>
  </div>

  <van-popup v-model="showWorkConfigPop" class="pop-config-work" :overlay="false" position="bottom">
    <div class="head">
      <van-button size="mini">整体配置</van-button>
    </div>
    <div class="scene-list">
      <div class="wrapper" :style="{width: (scenes.length+1) * 55 + 'px'}">
        <div class="block scene" v-for="(scene, index) in scenes" :key="index">
          <scene :scene="scene" :device="{width: 32, height: 60}" ></scene>
        </div>
        <div class="block add" v-tap.stop="tapAddScene">
          <van-icon name="add-o"></van-icon>
        </div>
      </div>
    </div>
  </van-popup>

  <van-popup v-model="showElementConfigPop" class="pop-config-element" :overlay="false" position="bottom">
    <element-edit v-model="currentElement"></element-edit>
  </van-popup>

  <van-popup v-model="showAddElement" class="pop-select-element" position="center" :overlay="true">
    <choose-add-element @selected="selectAddElement"></choose-add-element>
  </van-popup>
</div>
</template>

<script>
import Scene from './Scene'
import ChooseAddElement from './ChooseAddElement'
import ElementEdit from './ElementEdit'
import utils from '../utils/util'

const SCENE_TEMPLATE = {
  'template': 'designed',
  'hideDelay': 2000,
  'triggerClose': 3000,
  'elements': []
}

export default {
  name: 'Designer',
  components: {
    ElementEdit,
    Scene,
    ChooseAddElement
  },
  data () {
    return {
      isFullScreen: true,
      device: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      showWorkConfigPop: false,
      showElementConfigPop: false,
      showAddElement: false,
      currentScene: null,
      currentElement: {},
      scenes: [utils.clone(SCENE_TEMPLATE)],
      workMenu: ['1'],
      pageConfig: {
      }
    }
  },
  computed: {
    toolsHeight () {
      return 156
    },

    slideWidth () {
      if (this.isFullScreen) {
        return window.innerWidth
      } else {
        return (window.innerWidth * (window.innerHeight - this.toolsHeight) / window.innerHeight)
      }
    },
    slideHeight () {
      if (this.isFullScreen) {
        return window.innerHeight
      } else {
        return (window.innerHeight - this.toolsHeight)
      }
    },
    placeHeight () {
      if (this.isFullScreen) {
        return window.innerHeight
      } else {
        return (window.innerHeight - this.toolsHeight)
      }
    }
  },
  created () {
    this.currentScene = this.scenes[0]
  },
  methods: {
    longHoldPlace () {
      this.isFullScreen = false
      this.showWorkConfigPop = true
    },

    tapPlace () {
      this.isFullScreen = true
      this.showWorkConfigPop = false
      this.showElementConfigPop = false
    },

    tapAddElement () {
      this.showAddElement = true
    },

    tapAddScene () {
      this.addEmptyScene()
    },

    addEmptyScene () {
      this.scenes.push(utils.clone(SCENE_TEMPLATE))
      this.currentScene = this.scenes[this.scenes.length - 1]
    },
    selectAddElement (elementName) {
      this.showAddElement = false
      this.currentScene.elements.push({
        type: elementName,
        width: '30vw',
        height: '30vw',
        x: '20vw',
        y: '20vw'
      })
    },
    tapElementEdit (index) {
      debugger;
      this.currentElement = utils.clone(this.currentScene.elements[index])
      this.showElementConfigPop = true
      this.showWorkConfigPop = false
    }
  }
}
</script>

<style lang="less">

.designer.mobile {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #f2f2f2;
  .scene-wrapper {
    background-color: #fff;
    border: 1px solid #fefefe;
    border-radius: 10px;
    box-sizing: border-box;
    transition: transform .4s linear;
    &.preview {
      transform: scale(.7);
      transform-origin: center 30px;
    }
  }

  .van-icon-add {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 32px;
    z-index: 101;
  }

  .pop-config-work {
    height: 144px;
    .head {
      border-top: 1px solid #eee;
      padding: 5px;
    }
    .scene-list {
      margin-top: 5px;
      height: 100px;
      width: 100%;
      overflow-x: auto;
      .wrapper {
        display: flex;
        justify-content: space-around;
        .block {
          &.add {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
          }
          &.scene {
            border: 1px solid #eee;
          }
          position: relative;
          float: left;
          height: 96px;
          width: 48px;
        }
      }
    }
  }
}

</style>
