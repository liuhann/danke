<template>
<div class="designer mobile">
  <div class="scene-buttons">
    <van-icon name="plus" @click="showAddElement"/>
    <van-icon name="edit" @click.stop="pop.sceneList = true"/>
    <van-icon name="ellipsis" @click="showSceneList" />
  </div>
  <!--效果预览区-->
  <scene-preview :scene="currentScene" :device="device" class="scene-container"
    @element-selected="tapElementOn"
    @scene-selected="tapSceneOn"></scene-preview>

  <!--配置区，可以进行元素配置项手动修改 -->
  <van-popup class="pop-config" position="right" :overlay="false" v-model="pop.showConfig">
    <config-box :element="currentElement" :scene="currentScene" :device="device" @element-remove="removeCurrentElement"></config-box>
  </van-popup>

  <!--新增元素弹出框-->
  <van-popup class="pop-select-element" position="center" :overlay="true" v-model="pop.showAddElement">
    <add-element-popup @selected="selectAddElement"></add-element-popup>
  </van-popup>

  <!--页面列表、新增按钮-->
  <van-popup v-model="pop.sceneList" class="pop-page-list" position="left">
    <scene-list :scenes="scenes" :current-scene="currentScene" :device="device"
      @close="pop.sceneList = false"
      @add="tapAddScene"
      @choose-scene="chooseScene"></scene-list>
  </van-popup>
</div>
</template>

<script>
import ScenePreview from './ScenePreview'
import AddElementPopup from './AddElementPopup'
import SceneList from './SceneList'
import ConfigBox from './ConfigBox'
import utils from '../utils/util'
import styleUtils from '../utils/styles'
import position from '../utils/position'
import Elements from '../templates/elements'

export default {
  name: 'Designer',
  components: {
    ScenePreview,
    ConfigBox,
    AddElementPopup,
    SceneList
  },
  data () {
    return {
      pop: {
        showConfig: false,
        showAddElement: false,
        sceneList: false
      },
      device: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scenes: [],
      currentScene: null,
      currentElement: null,
      workConfig: {}
    }
  },

  computed: {
  },

  created () {
    this.tapAddScene()
    this.currentScene = this.scenes[0]
  },
  methods: {
    // 显示增加元素弹窗
    showAddElement () {
      this.pop.showAddElement = true
    },
    // 切换、管理场景
    showSceneList () {
      this.pop.sceneList = true
    },

    tapAddScene () {
      this.scenes.push({
        'template': 'designed',
        'play': 'auto',
        'hideDelay': 2000,
        'triggerClose': 3000,
        'elements': []
      })
    },

    tapShowResources () {

    },

    chooseScene (index) {
      this.pop.sceneList = false
      this.currentScene = this.scenes[index]
      this.currentElement = null
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

    // 选择新增一个element
    selectAddElement (elementName) {
      let newEl = null
      this.pop.showAddElement = false
      if (elementName === 'image') {
        newEl = utils.clone(Elements.IMAGE)
      }
      if (elementName === 'text') {
        newEl = utils.clone(Elements.TEXT)
      }
      newEl.id = utils.shortid()
      if (newEl && this.currentScene) {
        newEl.computedStyle = styleUtils.getElementStyle(newEl, this.device)
        this.currentScene.elements.push(newEl)
      }
    },
    tapElementOn (element) {
      this.currentElement = element
      this.pop.showConfig = true
    },
    tapSceneOn () {
      this.currentElement = null
      this.pop.showConfig = false
    },
    removeCurrentElement () {
      for (let i = 0; i < this.currentScene.elements.length; i ++) {
        if (this.currentScene.elements[i].id === this.currentElement.id) {
          this.currentScene.elements.splice(i, 1)
        }
      }
      this.currentElement = null
      this.pop.showConfig = false
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

  .pop-select-element {
    width: 80vw;
    height: 80vh;
    overflow-y: auto;
  }

  .scene-container {
    border: 1px solid #fefefe;
    border-radius: 10px;
    box-sizing: border-box;
  }

  .scene-buttons {
    position: absolute;
    bottom: 16px;
    right: 16px;
    font-size: 24px;
    z-index: 101;
    width: 100px;
    display: flex;
    justify-content: space-between;
    color: #666;
  }
}

</style>
