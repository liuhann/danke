<template>
<div class="designer mobile">
  <div class="bottom-button-bar">
    <van-icon class="icon-button small prev-scene" name="arrow-left" @click="prevScene"/>
    <van-icon class="icon-button add" name="plus" @click="showAddElement"/>
    <van-icon class="icon-button small next-scene" name="arrow" @click="nextScene"/>
  </div>
  <van-icon class="page-button icon-button menu" name="setting-o" @click.stop="pop.showMenus = true"/>

  <scene-preview v-if="backgroundScene" :scene="backgroundScene" :device="device" class="scene-container"></scene-preview>
  <!--效果预览区-->
  <scene-preview v-if="currentScene" :scene="currentScene" :device="device" class="scene-container" :element="currentElement"
    @element-selected="tapElementOn"></scene-preview>

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

  <van-popup class="pop-menus" position="right" :overlay="true" v-model="pop.showMenus">
    <config-scene :scene="currentScene" :work="work" :scenes="scenes" :scene-index="currentSceneIndex"
                  @choose-element="tapElementOn"
                  @scene-change="sceneChange">
    </config-scene>
  </van-popup>
</div>
</template>

<script>
import ScenePreview from './ScenePreview'
import SceneList from './dialog/SceneList'
import { mergeDeep, clone } from '../utils/object'
import { shortid } from '../utils/string'
import Elements from './templates/elements'
import TPL_SCENE from './templates/scene'
import ConfigElement from './dialog/ConfigElement'
import AddElement from './dialog/AddElement'

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
      pop: {
        showMenus: false,
        elementConfig: false,
        showAddElement: false
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
      if (work) {
        this.scenes = clone(work.scenes)
        this.currentSceneIndex = 1
        this.currentScene = this.scenes[0]
        this.work = clone(work)
      } else {
        this.work = clone(Elements.WORK)
        this.work.id = shortid()
        this.work.type = this.$route.query.type || 'full'
        this.tapAddScene()
        this.currentSceneIndex = 1
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

    tapAddScene () {
      const scene = clone(TPL_SCENE)
      scene.id = shortid()
      scene.title = '场景' + (this.scenes.length + 1)
      this.scenes.push(scene)
    },

    tapShowResources () {

    },

    prevScene () {
      if (this.currentSceneIndex > 1) {
        this.sceneChange(this.currentSceneIndex - 1)
      }
    },

    nextScene () {
      if (this.currentSceneIndex < this.scenes.length) {
        this.sceneChange(this.currentSceneIndex + 1)
      }
    },

    sceneChange (page) {
      this.currentSceneIndex = page
      this.currentScene = this.scenes[page - 1]
      this.currentElement = null
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

    removeElement (index) {
      this.currentScene.elements.splice(index, 1)
    },

    cloneElement (index) {
      const cloned = clone(this.currentScene.elements[index])
      cloned.id = shortid()
      this.currentScene.elements.push(cloned)
    },

    tapElementOn (index) {
      this.currentElement = this.currentScene.elements[index]
      this.pop.showMenus = false
      this.pop.elementConfig = true
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

    returnHome () {
      this.$router.replace('/')
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
    overflow: hidden;
    position: absolute;
    box-shadow: 0 0 8px 0px rgba(65, 106, 166, 0.2);
  }

  .icon-button {
    font-size: 20px;
    padding: 8px;
    border: 1px solid #efefef;
    border-radius: 28px;
    box-shadow: 0px 5px 15px -10px rgba(0,0,0,0.57);
    background-color: rgba(255, 255, 255, .9);
    &.small {
      padding: 4px;
      font-size: 18px;
    }
  }

  .bottom-button-bar {
    position: absolute;
    bottom: 10px;
    z-index: 1001;
    .icon-button {
      margin: 0 10px;
    }
  }

  .page-button {
    position: absolute;
    z-index: 1001;
    right: 8px;
    &.return {
      top: 8px;
      left: 8px;
      right: unset;
    }
    &.add {
      bottom: 8px;
    }
    &.menu {
      bottom: 8px;
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
  }
}

</style>
