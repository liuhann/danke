<template>
<div class="designer mobile">
  <div class="scene-buttons" v-if="currentElement === null">
    <van-icon name="plus" @click="tapAddElement"/>
    <van-icon name="setting-o" @click="toggleConfigMode"/>
  </div>
  <!--效果预览区-->
  <div class="scene-wrapper" :class="[isFullScreen? '': 'preview']" :style="{height: device.height + 'px', width: device.width + 'px'}">
    <scene v-if="currentScene" :scene="currentScene" :device="device" @element-selected="tapElementOn" @scene-selected="tapSceneOn"></scene>
  </div>

  <!--操作按钮列表-->
  <van-popup v-model="showSettingAside" class="pop-setting-aside" :overlay="false" position="right">
    <van-icon name="arrow" class="return" @click="toggleFullscreenMode"/>
    <van-icon name="setting-o" class="setting" >
      <span>配置</span>
    </van-icon>
    <van-icon name="apps-o" class="pages" @click="showPageListPop = true" >
      <span>全部页面</span>
    </van-icon>

    <van-icon name="add-o" class="add" @click="tapAddElement">
      <span>新增元素</span>
    </van-icon>
    <van-icon name="paid" class="add" @click="tapShowResources">
      <span>资源</span>
    </van-icon>
  </van-popup>

  <!--底部配置区-->
  <van-popup v-model="showElementConfigPop" class="pop-config-element" :overlay="false" position="bottom">
    <element-edit v-if="currentElement" :element="currentElement||currentScene"></element-edit>
  </van-popup>

  <!--新增元素弹出框-->
  <van-popup v-model="showAddElement" class="pop-select-element" position="center" :overlay="true">
    <choose-add-element @selected="selectAddElement"></choose-add-element>
  </van-popup>

  <!--页面列表、新增按钮-->
  <van-popup v-model="showPageListPop" class="pop-page-list" position="center" :overlay="true">
    <div class="pages-wrapper">
      <van-row type="flex" justify="space-around" class="header">
        <van-col span="21">
          <van-button plain type="primary" @click="addEmptyScene" size="small">新增</van-button>
          <van-button plain type="primary" @click="cloneCurrentScene" size="small">复制当前页</van-button>
        </van-col>
        <van-col span="2"><van-icon name="cross" @click="showPageListPop = false"></van-icon></van-col>
      </van-row>
      <div class="list">
        <div class="block scene" v-for="(scene, index) in scenes" :key="index" @click="chooseScene(index)" :class="[currentScene === scene?'current': '']">
          <scene :scene="scene" :device="{width: 64, height: 120}"></scene>
          <van-icon name="delete" @click.stop="deleteScene(index)"></van-icon>
          <div class="order">{{index+1}}</div>
        </div>
      </div>
    </div>
  </van-popup>
</div>
</template>

<script>
import Scene from './EditScene'
import ChooseAddElement from './ChooseAddElement'
import ElementEdit from './ElementEdit'
import SceneEdit from './SceneEdit'
import utils from '../utils/util'
import Elements from '../utils/elements'

export default {
  name: 'Designer',
  components: {
    ElementEdit,
    SceneEdit,
    'scene': Scene,
    ChooseAddElement
  },
  data () {
    return {
      isFullScreen: true,
      device: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scenes: [],
      currentScene: null,
      currentElement: null,
      workConfig: {},
      showWorkConfigPop: false,
      showAddElement: false,
      showSettingAside: false,
      showPageListPop: false
    }
  },
  computed: {
    toolsHeight () {
      return 156
    },

    showElementConfigPop: {
      get () {
        return !this.isFullScreen
      },
      set (newValue) {
        this.isFullScreen = !newValue
      }
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
    this.addEmptyScene()
    this.currentScene = this.scenes[0]
  },
  methods: {
    // 切换到编辑模式
    toggleConfigMode () {
      this.showSettingAside = true
      this.isFullScreen = false
    },
    // 切换到全屏模式
    toggleFullscreenMode () {
      this.isFullScreen = true
      this.showSettingAside = false
    },

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

    tapShowResources () {

    },

    addEmptyScene () {
      this.scenes.push({
        'template': 'designed',
        'hideDelay': 2000,
        'triggerClose': 3000,
        'elements': []
      })
    },

    chooseScene (index) {
      this.currentScene = this.scenes[index]
      this.currentElement = null
      this.showPageListPop = false
    },

    deleteScene (index) {
      vant.Dialog.confirm({
        title: '标题',
        message: '弹窗内容'
      }).then(() => {
        // on confirm
      }).catch(() => {
        // on cancel
      })
    },

    selectAddElement (elementName) {
      this.showAddElement = false
      this.addElement(elementName)
    },

    addElement (elementName) {
      if (elementName === 'image') {
        this.currentScene.elements.push(utils.clone(Elements.IMAGE))
      }
      if (elementName === 'text') {
        this.currentScene.elements.push({
          type: elementName,
          width: '80vw',
          x: '10vw',
          y: '20vh',
          content: '请输入文字',
          animationPreview: {}
        })
      }
    },
    tapElementOn (index) {
      // this.showElementConfigPop = true
      // this.showWorkConfigPop = false
      // this.isFullScreen = false
      this.currentElement = this.currentScene.elements[index]
    },
    tapSceneOn () {
      this.currentElement = null
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

  .scene-buttons {
    position: absolute;
    bottom: 16px;
    right: 16px;
    font-size: 24px;
    z-index: 101;
    width: 70px;
    display: flex;
    justify-content: space-between;
    color: #666;
  }

  .scene-wrapper {
    background-color: #fff;
    border: 1px solid #fefefe;
    border-radius: 10px;
    box-sizing: border-box;
    transition: transform .4s linear;
    transform-origin: 30px 30px;
    &.preview {
      transform: scaleX(.7) scaleY(.7);
    }
  }
  .pop-setting-aside {
    position: absolute;
    color: #666;
    z-index: 101;
    width: 15vw;
    right: 0;
    display: flex;
    top: 23%;
    background: none;
    flex-direction: column;
    .van-icon {
      margin-top: 2vw;
      height: 13vw;
      font-size: 6vw;
      text-align: center;
      display: flex;
      flex-direction: column;
      span {
        line-height: 20px;
        font-size: 9px;
      }
    }
  }

  .pop-page-list {
    .pages-wrapper {
      width: 320px;
      height: 480px;

      .header {
        line-height: 40px;
        height: 40px;
        border-bottom: 1px solid #E4E4E4;
        .van-button {
          margin-left: 10px;
        }
      }
      .list {
        height: 440px;
        overflow-y: auto;
        .block {
          width: 64px;
          height: 120px;
          margin: 5px 6px;
          float: left;
          box-sizing: border-box;
          overflow: hidden;
          &.scene {
            border: 1px solid #eee;
            border-radius: 5px;
            position: relative;
            &.current {
              border: 2px solid #4b0;
              .order {
                background: #4b0;
              }
            }
            .van-icon-delete {
              position: absolute;
              bottom: 10px;
              font-size: 18px;
              color: #f44;
              left: 21px;
            }
            .order {
              position: absolute;
              right: 5px;
              top: 5px;
              font-size: 12px;
              background: rgba(0,0,0,.6);
              color: #fff;
              width: 14px;
              border-radius: 7px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}

</style>
