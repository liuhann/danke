<template>
<div class="designer mobile">
  <div class="scene-buttons">
    <van-icon name="plus" @click="showAddElement"/>
    <van-icon name="edit" @click.stop="showConfigBox"/>
    <van-icon name="ellipsis" @click="showSceneList" />
  </div>

  <!--效果预览区-->
  <dragable-scene-edit ref="sceneEdit" :scene="currentScene" :device="device"
    @element-selected="tapElementOn"
    @scene-selected="tapSceneOn"
    @positioning="elementPositionChange"></dragable-scene-edit>

  <!--配置区，可以进行元素配置项手动修改 -->
  <config-box ref="configBox" :element="currentElement" :scene="currentScene" :device="device" @position-change="elementPositionChange"></config-box>

  <!--新增元素弹出框-->
  <add-element-popup ref="addElementPopUp" @selected="selectAddElement"></add-element-popup>

  <!--页面列表、新增按钮-->
  <scene-list-popup ref="sceneListPopup" :scenes="scenes" :current-scene="currentScene"
    @add-empty-scene="tapAddScene"
    @choose-scene="chooseScene"></scene-list-popup>

</div>
</template>

<script>
import DragableSceneEdit from './ScenePreview'
import AddElementPopup from './dialog/AddElement'
import SceneListPopup from './SceneList'
import ConfigBox from './ConfigBox'
import utils from '../utils/util'
import position from '../utils/position'
import Elements from '../templates/elements'

export default {
  name: 'Designer',
  components: {
    DragableSceneEdit,
    ConfigBox,
    AddElementPopup,
    SceneListPopup
  },
  data () {
    return {
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
    // 显示配置层
    showConfigBox () {
      console.log('show work box')
      this.$refs.configBox.show()
    },
    // 显示增加元素弹窗
    showAddElement () {
      this.$refs.addElementPopUp.show()
    },
    // 切换、管理场景
    showSceneList () {
      this.$refs.sceneListPopup.show()
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
      if (elementName === 'image') {
        newEl = utils.clone(Elements.IMAGE)
      }
      if (elementName === 'text') {
        newEl = utils.clone(Elements.TEXT)
      }
      if (newEl) {
        this.$refs.sceneEdit.addElement(newEl)
      }
    },
    tapElementOn (index) {
      this.currentElement = this.currentScene.elements[index]
    },
    tapSceneOn () {
      this.currentElement = null
    },
    elementPositionChange (event) {
      const vps = position.toViewPoint(event.element, event.newPos, this.currentScene.coordinate, this.device)
      if (this.currentElement) {
        this.currentElement.x = vps.x
        this.currentElement.y = vps.y
        this.currentElement.width = vps.w
        this.currentElement.height = vps.h
      }
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
