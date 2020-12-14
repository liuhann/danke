<template>
  <div id="xd-lite">
    <!--    拖拽、编辑区-->
    <mobile-edit-container v-if="work && scene" ref="editContainer" :scene="scene" :work="work" @focus-change="onElementFocused" />

    <!-- 上下文主菜单-->
    <pop-main-menu ref="popMainMenu" :work="work" :scene="scene" @action="onMenuAction" />

    <!-- 插入元素弹出层（菜单）-->
    <van-popup v-model="popupInsert" round position="bottom" :style="{ height: '50%' }">
      <van-nav-bar left-arrow @click-left="insertClickBack">
        <template #right>
          <van-icon name="close" size="20" @click="popupInsert=false" />
        </template>
      </van-nav-bar>
      <vector-album-list v-if="insertType==='vector-album'" @open="openPack" />

      <insert-text v-if="insertType === 'text'" :view-box="work.viewBox" @insert="insertNode" />
    </van-popup>

    <vector-list ref="popVectorList" @insert="insertNode" />
    <!--插入菜单-->
    <avatar-insert-menu ref="insertMenu" @open="onMenuOpen" />

    <!--插入图片-->
    <popup-image-list ref="popupImageList" @insert="insertNode" />
    <!--元素编辑弹出层-->
    <pop-element-edit ref="popElementEdit" :element="element" :scene="scene" />

    <van-popup v-model="popupEditForm" position="top" :style="{ height: '50%' }">
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
    <van-button id="add-button" round icon="plus" type="primary" @click="$refs.insertMenu.open()"></van-button>
    <van-button id="menu-button" round icon="setting-o" @click="onSettingClick"></van-button>
  </div>
</template>

<script>
import MobileEditContainer from './MobileEditContainer'
import InsertMenu from './insert/InsertMenu'
import AvatarInsertMenu from './insert/AvatarInsertMenu'
import VectorList from './insert/PopVectorList'
import VectorAlbumList from './insert/VectorAlbumList'
import workMixin from '../xd-builder/mixins/workMixin'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import { createSingleElement } from '../xd-builder/utils/sceneActions'
import Vue from 'vue'
import Vant from 'vant';
import { Toast, Notify } from 'vant';
import 'vant/lib/index.css';
import { addScene, prevScene, nextScene } from '../xd-builder/utils/workActions'
import TextList from '../xd-builder/left/TextList'
import PopElementEdit from './form/PopElementEdit'
import InsertText from './insert/InsertText'
import SceneEdit from './form/SceneEdit'
import PopMainMenu from './list/PopMainMenu'
import PopupImageList from './list/PopupImageList'
import { Lazyload } from 'vant';

Vue.use(Lazyload);
Vue.use(Vant);
export default {
  name: "Lite",
  components: { PopupImageList, PopMainMenu, SceneEdit, InsertText, PopElementEdit, MobileEditContainer, VectorList, VectorAlbumList, AvatarInsertMenu },
  mixins: [ workMixin ],
  data () {
    return {
      image: null,
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
  computed: {
    channel () {
      if (this.work) {
        return this.work.channel
      } else {
        return ''
      }
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
          this.closePops()
          Notify({ type: 'primary', message: '保存成功' });
          break
        case 'go-home':
          this.$router.replace('/creative/my')
          break;
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

    onMenuOpen (type, payload) {
      // 打开矢量图库列表
      if (type === 'vectors') {
        this.$refs.popVectorList.open(payload)
      }
    },
    onElementFocused (element) {
      this.element = element
    },

    onSettingClick () {
      if (this.element) {
        this.$refs.popElementEdit.open()
      } else {
        this.$refs.popMainMenu.open()
      }
    },

    openPack (pack) {
      this.insertType = 'vectors'
      this.currentPack = pack
    },

    insertNode(node) {
      // 关闭所有其他pops
      this.closePops()

      const created = createSingleElement(node, this.work.viewBox || { width: 320, height: 320})
      this.scene.elements.push(created)

      this.$nextTick(() => {
        this.$refs.editContainer.initElementDragResize(created)
      })
    },

    closePops () {
      this.$refs.insertMenu.close()
      this.$refs.popMainMenu.close()
      this.$refs.popVectorList.close()
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
      this.$refs.
      this.insertType = 'menu'
    }
  }

}
</script>

<style lang="scss">
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
