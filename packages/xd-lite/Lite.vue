<template>
  <div id="xd-lite">
    <mobile-edit-container v-if="work && scene" ref="editContainer" :scene="scene" :work="work" @hold="editNode" @focus-change="onElementFocused" />
    <van-popup v-model="popupMainMenu" position="bottom" closeable close-icon="close" :style="{ height: '50%', paddingTop: '48px' }">
      <main-menu :work="work" :scene="scene" @action="onMenuAction" />
    </van-popup>

    <!-- 插入元素弹出层（菜单）-->
    <van-popup v-model="popupInsert" round position="bottom" :style="{ height: '50%' }">
      <van-nav-bar left-arrow @click-left="insertClickBack">
        <template #right>
          <van-icon name="close" size="20" @click="popupInsert=false" />
        </template>
      </van-nav-bar>
      <insert-menu v-if="insertType==='menu'" @open="onMenuOpen" />
      <vector-album-list v-if="insertType==='vector-album'" @open="openPack" />
      <vector-list v-if="insertType === 'vectors'" :pack="currentPack" @insert="insertNode" />
      <image-list v-if="insertType === 'image'"></image-list>
      <insert-text v-if="insertType === 'text'" :view-box="work.viewBox" @insert="insertNode" />
    </van-popup>

    <van-popup v-model="popupEditForm" position="bottom" :style="{ height: '50%' }">
      <van-nav-bar>
        <template #right>
          <van-icon name="close" size="20" @click="popupEditForm = false" />
        </template>
        <template #left>
          属性编辑
        </template>
      </van-nav-bar>
      <element-edit v-if="element" :element="element" :scene="scene" @close="popupEditForm = false" />
      <scene-edit v-if="scene && !element" :scene="scene" />
    </van-popup>
    <van-button id="add-button" round icon="plus" type="primary" @click="openInsertDialog"></van-button>
    <van-button id="menu-button" round icon="setting-o" @click="onSettingClick"></van-button>
  </div>
</template>

<script>
import MobileEditContainer from './MobileEditContainer'
import InsertMenu from './insert/InsertMenu'
import InsertVector from './insert/InsertVector'
import VectorList from './insert/VectorList'
import VectorAlbumList from './insert/VectorAlbumList'
import workMixin from '../xd-builder/mixins/workMixin'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import { createSingleElement } from '../xd-builder/utils/sceneActions'
import Vue from 'vue'
import Vant from 'vant';
import { Toast, Notify } from 'vant';
import 'vant/lib/index.css';
import { addScene, prevScene, nextScene } from '../xd-builder/utils/workActions'
import { lockElement, unlockElement, moveUp, moveBottom, moveDown, moveTop } from '../xd-builder/utils/sceneActions'
import SceneList from './list/SceneList'
import DialogInsertVector from './insert/InsertVector'
import TextList from '../xd-builder/left/TextList'
import ElementEdit from './form/ElementEdit'
import InsertText from './insert/InsertText'
import SceneEdit from './form/SceneEdit'
import MainMenu from './list/MainMenu'
import ImageList from './list/ImageList'

Vue.use(Vant);
export default {
  name: "Lite",
  components: { ImageList, MainMenu, SceneEdit, InsertText, ElementEdit, InsertMenu, MobileEditContainer, VectorList, VectorAlbumList },
  mixins: [ workMixin ],
  data () {
    return {
      popupMainMenu: false,
      popupInsert: false,
      popupSceneList: false,
      popupEditForm: false,
      insertType: 'menu',
      currentPack: null,
      scene: null,
      work: null,
      element: null,
      insertVector: false
    }
  },
  mounted () {
    this.ctx.styleRegistry = new StyleRegistry(this.ctx)
    this.onMounted()
  },

  methods: {
    async onMenuAction (action) {
      switch (action) {
        case 'scene-setting':
          this.popupEditForm = true
          this.popupMainMenu = false
          break
        case 'add-scene':
          this.scene = addScene(this.work, this.scene)
          this.popupMainMenu = false
          break
        case 'scene-prev':
          this.scene = prevScene(this.work, this.scene)
          break
        case 'scene-next':
          this.scene = nextScene(this.work, this.scene)
          break
        case 'save-work':
          Toast.loading('保存作品中')
          await this.saveWork()
          Toast.clear(true)
          Notify({ type: 'primary', message: '保存成功' });
          this.popupMainMenu = false
          break
        case 'go-home':
          this.$router.replace('/creative/my')
          break;
        default:
          break
      }
    },


    onWorkSettingClick () {

    },

    onSceneSettingClick () {
      this.popupMainMenu = false
      this.popupEditForm = true
    },

    insert (payload) {
      this.insertMenuShow = false
      switch (payload) {
        case 'vector':
          this.insertVectorShow = false
          this.insertNode()
          break
        default:
          break
      }
    },
    async onMounted () {
      let workId = this.$route.query.work
      if (!workId) {
        this.work = this.newWork({
          width: this.$route.query.width,
          height: this.$route.query.height
        })
        this.addScene()
      } else {
        await this.loadWork(workId)
        this.scene = this.work.scenes[0]
      }
    },

    editNode (element) {
      this.element = element
      this.popupEditForm = true
    },

    onMenuOpen (type) {
      this.insertType = type
    },
    onElementFocused (element) {
      this.element = element
    },
    onSettingClick () {
      if (this.element) {
        this.popupEditForm = true
      } else {
        this.popupMainMenu = true
      }
    },

    setInsertType (type) {
      this.insertType = type
    },

    insertSelected (index) {
      switch (index) {
        case this.INSERT_VECTOR:
          this.insertDrawerShow = false
          this.insertVector = true
          break;
        default:
          break;
      }
    },

    openPack (pack) {
      this.insertType = 'vectors'
      this.currentPack = pack
    },

    insertNode(node) {
      this.popupInsert = false
      const created = createSingleElement(node, this.work.viewBox || { width: 320, height: 320})
      this.scene.elements.push(created)

      this.$nextTick(() => {
        this.$refs.editContainer.initElementDragResize(created)
      })
    },


    insertClickBack () {
      switch (this.insertType) {
        case 'menu':
          this.popupInsert = false
          break
        case 'vector-album':
          this.insertType = 'menu'
          break
        case 'vectors':
          this.insertType = 'vector-album'
          break
        default:
          break
      }
    },

    openInsertDialog () {
      this.popupInsert = true
      this.insertType = 'menu'
    }
  }

}
</script>

<style>
#xd-lite {
  height: 100%;
  -webkit-user-select: none;
}

.van-button--normal {
  padding: 0 13px;
}
#menu-button {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  z-index: 101;
}
#add-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 101;
}
</style>
