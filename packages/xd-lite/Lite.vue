<template>
  <div id="xd-lite">
    <!--    拖拽、编辑区-->
    <mobile-edit-container v-if="work && scene" ref="editContainer" :scene="scene" :work="work" :element="element" @focus-change="onElementFocused" />
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

    <van-button id="add-button" round icon="plus" type="primary" @click="$refs.insertMenu.open()"></van-button>

    <!--    <transition name="van-slide-up">-->
    <!--      <van-button v-show="element" id="element-config" plain hairline type="primary" round icon="edit" @click="editNode"></van-button>-->
    <!--    </transition>-->

    <transition name="van-slide-left">
      <div v-if="element" id="element-actions">
        <!--删除按钮-->
        <van-button id="delete-button" type="danger" round icon="delete" @click="onDelete" />
        <!--元素遮罩  仅限图片有-->
        <van-button v-show="elementMask" id="mask-button" icon="user-circle-o" round @click="onMask"></van-button>
        <btn-color-picker v-for="(variable, index) in elementColorVariables" :key="index" v-model="variable.value" round :default-colors="workColors" />
        <btn-set-text v-if="element.text" :element="element" />
        <btn-edit-text v-if="element.text" v-model="element.text" />
      </div>
    </transition>
    <van-button id="menu-button" round icon="setting-o" @click="onSettingClick"></van-button>
    <font-family ref="fontFamilly" @input="updateVariableValue" />
    <pop-vector-album-list ref="albumListPop" @input="choosePack" />
    <pop-album-vector ref="popAlbumVector" @input="chooseMask" />
    <pop-vector-list ref="vectorListPop" title="选择裁切图案" @insert="chooseVector" />
  </div>
</template>

<script>
import MobileEditContainer from './MobileEditContainer'
import AvatarInsertMenu from './insert/AvatarInsertMenu'
import VectorList from './list/PopVectorList'
import workMixin from '../xd-builder/mixins/workMixin'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import { createSingleElement, deleteElement, getElementMask, elementColorVariables, elementPxVariables } from '../xd-builder/utils/sceneActions'
import { addScene, prevScene, nextScene, getWorkColors } from '../xd-builder/utils/workActions'
import PopElementEdit from './form/PopElementEdit'
import PopMainMenu from './list/PopMainMenu'
import PopupImageList from './list/PopupImageList'
import PopUnSplashPhotoList from './insert/PopUnSplashPhotoList'
import Vue from 'vue'
import Vant from 'vant';
import { Toast, Notify } from 'vant'
import { text } from '../xd-builder/templates'
import 'vant/lib/index.css';
import { Lazyload } from 'vant';
import PopElementOrdering from './list/PopElementOrdering'
import BtnColorPicker from './van-components/BtnColorPicker'
import BtnSetText from './van-components/BtnSetText'
import BtnEditText from './van-components/BtnEditText'
import FontFamily from './form/FontFamily.vue'
import PopVectorAlbumList from './list/PopVectorAlbumList'
import PopVectorList from './list/PopVectorList'
import PopAlbumVector from './insert/PopAlbumVector'

Vue.use(Lazyload);
Vue.use(Vant);
export default {
  name: "Lite",
  components: {
    PopAlbumVector,
    BtnEditText,
    BtnSetText,
    BtnColorPicker,
    PopElementOrdering,
    PopupImageList,
    PopMainMenu,
    PopElementEdit,
    MobileEditContainer,
    VectorList,
    AvatarInsertMenu,
    PopUnSplashPhotoList,
    FontFamily,
    PopVectorAlbumList,
    PopVectorList
  },
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
    workColors () {
      return getWorkColors(this.work)
    },
    elementMask () {
      return getElementMask(this.element)
    },
    elementColorVariables () {
      return elementColorVariables(this.element)
    },
    elementPxVariables () {
      return elementPxVariables(this.element)
    },
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
          width: parseInt(this.$route.query.width),
          height: parseInt(this.$route.query.height)
        })
        this.addScene()
      } else {
        await this.loadWork(workId)
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

    /**
     * 插入元素主菜单上进一步选择
     * @param type
     * @param payload
     */
    onInsertMenuTab (type, payload) {
      // 打开矢量图库列表
      if (type === 'vectors') {
        this.$refs.popVectorList.open(payload)
      }
      if (type === 'unsplash') {
        this.$refs.unsplashPhotoList.open(payload, payload)
      }
      if (type === 'text') {
        const created = createSingleElement(JSON.parse(JSON.stringify(text)), this.work.viewBox || { width: 320, height: 320})
        this.scene.elements.push(created)
        this.element = created
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

    onDelete () {
      deleteElement(this.element, this.scene)
      this.element = null
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
        // this.$refs.editContainer.initElementDragResize(created)
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

    chooseVector () {

    },

    onMask () {
      this.$refs.popAlbumVector.open('mask')
    },
    choosePack (pack) {
      this.$refs.vectorListPop.open(pack._id)
    },

    chooseMask (vector) {
      this.element.maskImage = vector.url
    },

    updateVariableValue (val) {
      if (this.variable) {
        this.variable.value = val
      } else {
        this.element.fill = val
      }
    },
  }

}
</script>

<style lang="scss">
#xd-lite {
  height: 100%;
  -webkit-user-select: none;
  .van-button--normal {
    padding: 0 13px;
    height: 50px;
    font-size: 20px;
  }
}

.work-loaded {
  height: 100%;
}
#menu-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 100;
}
#add-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 101;
}

#element-actions {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  height: 90vh;
  display: flex;
  flex-direction: column-reverse;
  z-index: 101;
  .van-button--normal {
    margin-top: .75rem;
  }
}

.inplace-action-btn {
  border: 1px solid #ccc;
  border-radius: 40px;
  padding: 5px;
}
#element-config {
  position: absolute;
  right: 5.5em;
  bottom: 1rem;
  z-index: 101;
}



</style>
