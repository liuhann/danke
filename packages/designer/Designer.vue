<template>
<div class="designer mobile">
  <van-icon class="page-button add" name="plus" @click="showAddElement"/>
  <van-icon class="page-button menu" name="wap-nav" @click.stop="pop.showMenus = true"/>

  <scene-preview v-if="backgroundScene" :scene="backgroundScene" :device="device"></scene-preview>
  <!--效果预览区-->
  <scene-preview v-if="currentScene" :scene="currentScene" :device="device" class="scene-container"
    @element-selected="tapElementOn"
    @scene-selected="tapSceneOn"></scene-preview>

  <!--元素配置区，可以进行元素配置项手动修改 -->
  <van-popup class="pop-element-config" position="right" :overlay="true" v-model="pop.elementConfig">
    <keep-alive>
      <config-element v-if="currentElement" :edit-element="currentElement" :device="device" @close="pop.elementConfig = false"
        @swap="swapElement"
        @element-remove="removeCurrentElement"
      ></config-element>
    </keep-alive>
  </van-popup>

  <!--新增元素弹出框-->
  <van-popup class="pop-select-element" position="center" :overlay="true" v-model="pop.showAddElement">
    <add-element @selected="selectAddElement"></add-element>
  </van-popup>

  <!--页面列表、新增按钮-->
  <van-popup v-model="pop.sceneList" class="pop-page-list" position="right">
    <scene-list :scenes="scenes" :current-scene="currentScene" :device="device"
      @close="pop.sceneList = false;"
      @preview="previewPlay"
      @add="tapAddScene"
      @choose-scene="chooseScene"></scene-list>
  </van-popup>

  <van-popup class="pop-menus" position="right" :overlay="true" v-model="pop.showMenus">
    <van-tabs v-model="tabConfig">
      <van-tab title="场景配置">
        <div class="tools-bar">
          <van-button size="small" @click="pop.sceneList = true">场景列表</van-button>
          <van-button size="small" @click="togglePreviousScene">上一场景</van-button>
          <van-button size="small" @click="toggleNextScene">下一场景</van-button>
        </div>
        <config-scene v-model="currentScene" v-if="currentScene" class="scene-config"></config-scene>
        <div class="tools-bar">
          <van-button size="small" type="danger">删除场景</van-button>
        </div>
      </van-tab>
      <van-tab title="作品配置">
        <item-block title="标题">
          <van-field v-if="work" v-model="work.title" required clearable/>
        </item-block>
        <div class="tools-bar">
          <van-button size="small" type="primary" @click="previewPlay">播放</van-button>
          <van-button size="small" type="primary" @click="saveDraft">保存草稿</van-button>
        </div>
      </van-tab>
    </van-tabs>
  </van-popup>
</div>
</template>

<script>
import ScenePreview from './ScenePreview'
import SceneList from './dialog/SceneList'
import { mergeDeep, clone } from '../utils/object'
import { shortid } from '../utils/string'
import Elements from './templates/elements'
import ConfigElement from './dialog/ConfigElement'
import AddElement from './dialog/AddElement'

import saver from './saver'
import ConfigScene from './dialog/ConfigScene'
import ItemBlock from './forms/ItemBlock'

export default {
  name: 'Designer',
  components: {
    ItemBlock,
    ConfigScene,
    AddElement,
    ConfigElement,
    ScenePreview,
    SceneList
  },
  data () {
    return {
      tabConfig: 0,
      pop: {
        showMenus: false,
        elementConfig: false,
        showAddElement: false,
        sceneList: false
      },
      device: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scenes: [],
      currentSceneIndex: 0,
      currentScene: null,
      currentElement: null,
      work: null
    }
  },

  computed: {
    backgroundScene () {
      let back = null
      for (let i=0; i < this.scenes.length; i++) {
        if (this.currentScene === this.scenes[i]) {
          break
        }
        if (this.scenes[i].type === 'background') {
          back = this.scenes[i]
        }
      }
      return back
    }
  },

  created () {
    this.init()
  },
  methods: {
    async init () {
      if (this.$route.query.id) { // load work
        const work = await this.ctx.workdao.getWork(this.$route.query.id)
        this.initDevice(work.type || 'full')
        this.initWork(work)
      } else { // new work or load from ctx
        this.initDevice(this.$route.query.type)
        this.initWork(this.ctx.work)
      }
    },

    initDevice (type) {
      this.device.width = window.innerWidth
      this.device.height = window.innerHeight
      if (type === '1x1') {
        this.device.height = window.innerWidth
      } else if (type === '3x2') {
        this.device.height = Math.floor(window.innerWidth * 3 /2)
      }
    },
    initWork (work) {
      debugger
      if (work) {
        this.scenes = clone(work.scenes)
        this.currentSceneIndex = 0
        this.currentScene = this.scenes[0]
        this.work = clone(this.ctx.work)
      } else {
        this.work = clone(Elements.WORK)
        this.work.id = shortid()
        this.work.type = this.$route.query.type || 'full'
        this.tapAddScene()
        this.currentSceneIndex = 0
        this.currentScene = this.scenes[0]
      }
    },
    // 显示增加元素弹窗
    showAddElement () {
      this.pop.showAddElement = true
    },

    // 切换、管理场景
    showSceneList () {
      this.pop.sceneList = true
    },

    tapAddScene (index, isAfter) {
      const scene = clone(Elements.SCENE)
      scene.id = shortid()

      if (index != null) {

      }
      this.scenes.push(scene)
    },

    tapShowResources () {

    },

    chooseScene (index) {
      this.pop.sceneList = false
      this.currentSceneIndex = index
      this.currentScene = this.scenes[index]
      this.currentElement = null
    },

    toggleNextScene () {
      if (this.currentSceneIndex === this.scenes.length -1) {
        this.tapAddScene()
      }
      this.currentSceneIndex ++
      this.currentScene = this.scenes[this.currentSceneIndex]
    },

    togglePreviousScene () {
      if (this.currentSceneIndex === 0) {
        return
      }
      this.currentSceneIndex --
      this.currentScene = this.scenes[this.currentSceneIndex]
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
        newEl = clone(Elements.IMAGE)
      }
      if (elementName === 'text') {
        newEl = clone(Elements.TEXT)
      }
      newEl.id = shortid()
      if (newEl && this.currentScene) {
        this.currentScene.elements.push(newEl)
      }
    },

    tapElementOn (element) {
      this.currentElement = element
      this.pop.elementConfig = true
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
      this.pop.elementConfig = false
    },

    swapElement (direction) {
      let currentIndex = 0
      for (let i = 0; i < this.currentScene.elements.length; i++) {
        if ( this.currentScene.elements[i].id === this.currentElement.id) {
          currentIndex = i
          break
        }
      }
      if (direction === 'top') {
        this.currentScene.elements[currentIndex] = this.currentScene.elements[this.currentScene.elements.length - 1]
        this.currentScene.elements[this.currentScene.elements.length - 1] = this.currentElement
      }
    },

    saveDraft () {
      this.ctx.workdao.addOrUpdateWork(Object.assign(this.work, {
        scenes: this.scenes
      }))
    },

    previewPlay () {
      this.ctx.work = clone({
        scenes: this.scenes
      })
      if (!this.ctx.work.uid) {
        this.ctx.work.uid = shortid(6)
      }
      this.ctx.work.user = 'test'
      this.ctx.workdao.addOrUpdateWork(this.ctx.work)
      this.$router.push('/play')
    }
  }
}
</script>

<style lang="less">

.designer.mobile {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #FBFBFB;
  display: flex;
  justify-content: center;
  align-items: center;

  .scene-container {
    box-shadow: 0 0 8px 0px rgba(65, 106, 166, 0.2);
    background-color: #fff;
  }
  .page-button {
    font-size: 20px;
    padding: 8px;
    border: 1px solid #efefef;
    border-radius: 28px;
    box-shadow: 0px 5px 15px -10px rgba(0,0,0,0.57);
    position: absolute;
    z-index: 1001;
    right: 8px;
    background-color: #fff;
    &.add {
      bottom: 8px;
    }
    &.menu {
      top: 8px;
    }
  }

  .pop-element-config {
    border-left: 1px solid #eee;
    background-color: #fafafa;
    z-index: 9999;
    width: 88vw;
    height: 100vh;
  }

  .pop-select-element {
    z-index: 9999;
    width: 80vw;
    height: 80vh;
    overflow-y: auto;
  }

  .pop-app-config {
    width: 100vw;
    height: 100vh;
  }

  .scene-container {
    box-sizing: border-box;
  }

  .pop-menus {
    z-index: 9999;
    width: 85vw;
    height: 100vh;
    background-color: #efefef;
    .tools-bar {
      display: flex;
      margin: 8px;
    }
  }
}

</style>
