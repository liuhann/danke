<template>
  <div id="xd-lite">
    <mobile-edit-container v-if="work && scene" ref="editContainer" :scene="scene" :work="work" @hold="editNode" />
    <van-popup v-model="configPopupShow" round position="right" :style="{ width: '60%', height: '100%' }">
      <van-cell-group title="配置">
        <van-cell title="作品属性" icon="setting-o" />
        <van-cell title="页面属性" icon="orders-o" />
        <van-cell title="页面列表" icon="apps-o" />
        <van-cell title="前一页" icon="arrow-up" />
        <van-cell title="后一页" icon="arrow-down" />
      </van-cell-group>
      <van-cell-group title="保存与分享">
        <van-cell title="保存" icon="save-o" @click="onSaveWork" />
      </van-cell-group>
    </van-popup>

    <!-- 插入元素弹出层（菜单）-->
    <van-popup v-model="insertPopupShow" round position="bottom" :style="{ height: '100%' }">
      <van-nav-bar left-arrow @click-left="insertClickBack">
        <template #right>
          <van-icon name="close" size="20" @click="insertPopupShow=false" />
        </template>
      </van-nav-bar>
      <insert-menu v-if="insertType==='menu'" @open="onMenuOpen" />
      <vector-album-list v-if="insertType==='vector-album'" @open="openPack" />
      <vector-list v-if="insertType === 'vectors'" :pack="currentPack" @insert="insertNode" />
      <insert-text v-if="insertType === 'text'" :view-box="work.viewBox" @insert="insertNode" />
    </van-popup>

    <van-popup v-model="editElementPopupShow" position="top" :style="{ height: '100%' }">
      <van-nav-bar>
        <template #right>
          <van-icon name="close" size="20" @click="editElementPopupShow = false" />
        </template>
        <template #left>
          属性编辑
        </template>
      </van-nav-bar>
      <element-edit v-if="element" :element="element" :scene="scene" @close="editElementPopupShow = false" />
    </van-popup>

    <button id="add-button" class="button is-success is-medium" @click="openInsertDialog">
      <span class="icon">
        <i class="el-icon-plus"></i>
      </span>
    </button>
    <button id="menu-button" class="button is-medium" @click="configPopupShow = true">
      <span class="icon">
        <i class="el-icon-setting"></i>
      </span>
    </button>
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
import { lockElement, unlockElement, moveUp, moveBottom, moveDown, moveTop } from '../xd-builder/utils/sceneActions'

import DialogInsertVector from './insert/InsertVector'
import TextList from '../xd-builder/left/TextList'
import ElementEdit from './form/ElementEdit'
import InsertText from './insert/InsertText'

Vue.use(Vant);
export default {
  name: "Lite",
  components: { InsertText, ElementEdit, InsertMenu, MobileEditContainer, VectorList, VectorAlbumList },
  mixins: [ workMixin ],
  data () {
    return {
      configPopupShow: false,
      insertPopupShow: false,
      editElementPopupShow: false,
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

    async onSaveWork () {
      this.configPopupShow = false
      Toast.loading('保存作品中')
      await this.saveWork()
      Toast.clear(true)
      Notify({ type: 'primary', message: '保存成功' });
    },

    editNode (element) {
      this.element = element
      this.editElementPopupShow = true
    },

    onMenuOpen (type) {
      this.insertType = type
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
      this.insertPopupShow = false
      const created = createSingleElement(node, this.work.viewBox || { width: 320, height: 320})
      this.scene.elements.push(created)

      this.$nextTick(() => {
        this.$refs.editContainer.initElementDragResize(created)
      })
    },

    menuSelected (index) {
      switch (index) {
        case this.MENU_SAVE:
          this.saveWork()
          break;
        default:
          break;
      }
    },

    insertClickBack () {
      switch (this.insertType) {
        case 'menu':
          this.insertPopupShow = false
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
      this.insertPopupShow = true
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

#menu-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
  border-radius: 20rem;
  z-index: 101;
}
#add-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  border-radius: 20rem;
  z-index: 101;
}
</style>