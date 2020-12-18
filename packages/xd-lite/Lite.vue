<template>
  <div id="xd-lite">
    <!--    拖拽、编辑区-->
    <mobile-edit-container v-if="work && scene" ref="editContainer" :scene="scene" :work="work" @focus-change="onElementFocused" />
    <!-- 上下文主菜单-->
    <pop-main-menu ref="popMainMenu" :page-enabled="false" :work="work" :scene="scene" @action="onMenuAction" />
    <!--插入菜单-->
    <avatar-insert-menu ref="insertMenu" @open="onInsertMenuTab" />
    <!--插入矢量图片弹框-->
    <vector-list ref="popVectorList" @insert="insertNode" />
    <!--插入图片-->
    <popup-image-list ref="popupImageList" @insert="insertNode" />
    <!--调用获取unSplash的图片-->
    <pop-un-splash-photo-list ref="unsplashPhotoList" @insert="insertNode" />
    <!--元素编辑弹出层-->
    <pop-element-edit ref="popElementEdit" @delete="deleteNode" @insert="insertNode" />

    <!--元素编辑弹出层-->
    <pop-element-ordering v-if="work" ref="popElementOrdering" :scene="scene" :view-box="work.viewBox" />

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
    <transition name="van-slide-up">
      <van-button v-show="element" id="element-config" plain hairline type="primary" round icon="edit" @click="editNode"></van-button>
    </transition>
    <van-button id="menu-button" round icon="ellipsis" @click="onSettingClick"></van-button>
  </div>
</template>

<script>
import MobileEditContainer from './MobileEditContainer'
import AvatarInsertMenu from './insert/AvatarInsertMenu'
import VectorList from './list/PopVectorList'
import workMixin from '../xd-builder/mixins/workMixin'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import { createSingleElement, deleteElement } from '../xd-builder/utils/sceneActions'
import { addScene, prevScene, nextScene } from '../xd-builder/utils/workActions'
import PopElementEdit from './form/PopElementEdit'
import SceneEdit from './form/SceneEdit'
import PopMainMenu from './list/PopMainMenu'
import PopupImageList from './list/PopupImageList'
import PopUnSplashPhotoList from './insert/PopUnSplashPhotoList'
import Vue from 'vue'
import Vant from 'vant';
import { Toast, Notify } from 'vant';
import { text } from '../xd-builder/templates'
import 'vant/lib/index.css';
import { Lazyload } from 'vant';
import PopElementOrdering from './list/PopElementOrdering'

Vue.use(Lazyload);
Vue.use(Vant);
export default {
  name: "Lite",
  components: { PopElementOrdering, PopupImageList, PopMainMenu, SceneEdit, PopElementEdit, MobileEditContainer, VectorList,AvatarInsertMenu, PopUnSplashPhotoList },
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
        case 'element-list':
          this.closePops()
          this.$refs.popElementOrdering.open()
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

    editNode () {
      this.$refs.popElementEdit.open(this.element, true)
    },

    onInsertMenuTab (type, payload) {
      // 打开矢量图库列表
      if (type === 'vectors') {
        this.$refs.popVectorList.open(payload)
      }
      if (type === 'unsplash') {
        this.$refs.unsplashPhotoList.open(payload, payload)
      }
      if (type === 'text') {
        this.$refs.popElementEdit.open(JSON.parse(JSON.stringify(text)), false)
      }
      if (type === 'uploads') {
        this.$refs.popupImageList.open()
      }
    },
    onElementFocused (element) {
      this.element = element
    },

    onSettingClick () {
      this.$refs.popMainMenu.open()
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

    deleteNode(node) {
      deleteElement(node, this.scene)
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
.work-loaded {
  height: 100%;
}

.van-button--normal {
  padding: 0 13px;
}
#menu-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 101;
}
#add-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 101;
}
#element-config {
  position: absolute;
  right: 5.5em;
  bottom: 1rem;
  z-index: 101;
}
</style>
