<template>
<div class="designer mobile">
  <div class="scene-buttons">
    <van-icon name="plus" @click="showAddElement"/>
    <van-icon name="apps-o" @click.stop="pop.sceneList = true"/>
  </div>

  <scene-preview v-if="backgroundScene" :scene="backgroundScene" :device="device"></scene-preview>
  <!--效果预览区-->
  <scene-preview :scene="currentScene" :device="device" class="scene-container"
    @element-selected="tapElementOn"
    @scene-selected="tapSceneOn"></scene-preview>

  <!--元素配置区，可以进行元素配置项手动修改 -->
  <van-popup class="pop-element-config" position="right" :overlay="false" v-model="pop.elementConfig">
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
      @close="pop.sceneList = false"
      @preview="previewPlay"
      @add="tapAddScene"
      @choose-scene="chooseScene"></scene-list>
  </van-popup>

</div>
</template>

<script>
import ScenePreview from './ScenePreview'
import SceneList from './dialog/SceneList'
import utils from '../utils/util'
import Elements from './templates/elements'
import ConfigElement from './dialog/ConfigElement'
import ConfigWork from './dialog/ConfigWork'
import AddElement from './dialog/AddElement'

import saver from './saver'

export default {
  name: 'Designer',
  components: {
    AddElement,
    ConfigWork,
    ConfigElement,
    ScenePreview,
    SceneList
  },
  data () {
    return {
      pop: {
        elementConfig: false,
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
      work: utils.mergeDeep({}, Elements.WORK)
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
    if (this.ctx.work) {
      this.scenes = utils.clone(this.ctx.work.scenes)
      this.currentScene = this.scenes[0]
      this.work = utils.clone(this.ctx.work)
    } else {
      this.tapAddScene()
      this.currentScene = this.scenes[0]

      this.nanobus.on('image-attach', (resource) => {
        saver.saveResource(resource)
      })
    }
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
      const scene = utils.clone(Elements.SCENE)
      scene.id = utils.shortid()
      this.scenes.push(scene)
    },

    tapShowResources () {

    },

    chooseScene (scene) {
      this.pop.sceneList = false
      this.currentScene = scene
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

    previewPlay () {
      const transitions = []
      for (let i = 0; i < this.scenes.length; i ++) {
        transitions.push({
          from: (i === 0) ? null: (i-1),
          to : i
        })
      }

      this.ctx.work = utils.clone({
        play: this.work.play,
        background: this.work.background,
        scenes: this.scenes,
        transitions
      })
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
  width: 100vw;
  height: 100vh;

  .pop-element-config {
    border-left: 1px solid #eee;
    background-color: #fafafa;
    z-index: 1001;
    width: 88vw;
    height: 100vh;
  }

  .pop-select-element {
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

  .scene-buttons {
    position: absolute;
    bottom: 15px;
    right: 15px;
    font-size: 24px;
    z-index: 101;
    width: 85px;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    color: #fff;
    background: rgba(0,0,0, .5);
    padding: 10px;
    border-radius: 4px;
  }
}

</style>
