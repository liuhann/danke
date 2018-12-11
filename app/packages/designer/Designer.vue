<template>
<div class="designer mobile">
  <div class="scene-place" :style="{height: placeHeight}" v-hold="longHoldPlace">
    <van-swipe indicator-color="white" :width="slideWidth" :height="slideHeight">
      <van-swipe-item v-for="(scene, index) in scenes" :key="index">
        <scene :scene="scene" :device="{width: slideWidth, height: slideHeight}"></scene>
      </van-swipe-item>
    </van-swipe>
    <van-icon name="add" @click="showAddElement=true"/>
  </div>

  <van-popup v-model="showWorkConfigPop" :overlay="false" position="bottom">
    <van-tabs class="tabs-work-config">
      <van-tab title="页面">
        <div class="scene-list">
          <scene :scene="scene" :device="{width: 32, height: 60}" v-for="(scene, index) in scenes" :key="index"></scene>
        </div>
        <van-button size="mini" icon="add" @click="addEmptyScene">增加</van-button>
      </van-tab>
      <van-tab title="配置">
        <cell title="圆形" :clickable="true" icon="check" />
        <cell title="方形" :clickable="true" icon="location" />
        <cell title="三角形" :clickable="true" icon="location" />
      </van-tab>
      <van-tab title="保存">

      </van-tab>
    </van-tabs>
  </van-popup>

  <van-popup v-model="showElementConfigPop">

  </van-popup>

  <van-popup v-model="showAddElement" class="pop-select-element" position="center" :overlay="true">
    <choose-add-element @selected="selectAddElement"></choose-add-element>
  </van-popup>

</div>
</template>

<script>
import Scene from './Scene'
import ChooseAddElement from './ChooseAddElement'
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
      scenes: [utils.clone(SCENE_TEMPLATE)],
      workMenu: ['1'],
      pageConfig: {
      }
    }
  },
  computed: {
    toolsHeight () {
      return 140
    },

    slideWidth () {
      if (this.isFullScreen) {
        return window.innerWidth + 'px'
      } else {
        return (window.innerWidth * (window.innerHeight - this.toolsHeight) / window.innerHeight) + 'px'
      }
    },
    placeHeight () {
      if (this.isFullScreen) {
        return window.innerHeight + 'px'
      } else {
        return (window.innerHeight - this.toolsHeight) + 'px'
      }
    },
    slideHeight () {
      if (this.isFullScreen) {
        return window.innerHeight + 'px'
      } else {
        return (window.innerHeight - this.toolsHeight) + 'px'
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
    selectEditElement (index) {

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
  .scene-place {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-icon-add {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 32px;
    }
  }

  .tabs-work-config {
    height: 140px;
  }

}

</style>
