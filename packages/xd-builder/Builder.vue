<template>
  <div class="xd-builder">
    <system-bar :work="work" @command="handleSystemBarCommand" />
    <div id="xd" class="design-area">
      <left-aside />
      <section v-if="work && scene" class="right-section">
        <toolbar :work="work" :scene="scene" @command="onCommand" />
        <scene-container :work="work" :scene="scene" />
      </section>
    </div>
    <el-drawer title="元素列表" destroy-on-close :visible.sync="drawer.elementList" direction="rtl" :modal="false" size="360px" :wrapper-closable="false" :with-header="false">
      <scene-element-list :scene="scene" @close="toggleShowDrawer" />
    </el-drawer>
    <pop-element-anime :visible.sync="drawer.elementProp" :element-prop-key="currentElementPropEdit" :elements="selectedElements" :scene="scene" />
    <el-drawer title="场景列表" destroy-on-close :visible.sync="drawer.sceneList" direction="rtl" :modal="false" size="1024px" :wrapper-closable="false" :with-header="false">
      <scene-list :work="work" @choose-scene="chooseScene" @close="toggleShowDrawer" />
    </el-drawer>
    <pop-scene-preview :scene="scene" :visible.sync="drawer.scenePlay" :view-box="work.viewBox" />
  </div>
</template>
<script>
import StyleRegistry from './utils/StyleRegistry.js'
import workMixin from './mixins/workMixin.js'
import sceneMixin from './mixins/sceneMixins.js'
import SceneContainer from './SceneContainer.vue'
import LeftAside from './left/LeftAside.vue'
import Toolbar from './toolbar/Toolbar.vue'
import SceneList from './left/SceneList.vue'
import SceneElementList from './left/SceneElementList.vue'
import FrameListConfig from './left/FrameListConfig.vue'
import './import-element-ui.js'
import Mousetrap from 'mousetrap'

import { newWork, addScene, nextScene, prevScene, saveWork } from './utils/workActions'

import SystemBar from './components/SystemBar.vue'
import PopElementAnime from './components/PopElementAnime.vue'
import PopElementStyle from './components/PopElementStyle.vue'
import PopScenePreview from './components/PopScenePreview.vue'
import { Message } from 'element-ui'

export default {
  name: 'Builder',
  components: {
    PopElementAnime,
    PopElementStyle,
    SystemBar,
    SceneList,
    Toolbar,
    SceneContainer,
    SceneElementList,
    FrameListConfig,
    PopScenePreview,
    LeftAside
  },
  mixins: [ sceneMixin, workMixin ],
  props: {
  },
  data () {
    return {
      currentElementPropEdit: '',
      drawer: {
        scenePlay: false,
        animation: false,
        elementProp: false,
        elementList: false,
        sceneList: false,
        workProp: false,
        style: false
      },
      viewPortRect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      pen: '',
      work: null,
      scene: null,
      scale: 1,
      paste: null
    }
  },

  created () { },

  mounted () {
    this.ctx.styleRegistry = new StyleRegistry(this.ctx)
    this.onMounted()
  },

  methods: {
    async handleSystemBarCommand (cmd) {
      switch (cmd) {
        case 'save-work':
          this.handleSaveWork()
          break
        case 'export-video':
          window.open('/work/frame/' + this.work._id)
          break
        case 'viewbox-resize':
          await saveWork(this.work, this.ctx);
          this.$router.replace(location.pathname + '?work=' + this.work.id)
          break
        case 'play-scene':
          this.drawer.scenePlay = true;
          break
        default:
          break
      }
    },

    async handleSaveWork () {
      const result = await saveWork(this.work, this.ctx);
      if (!this.work._id) {
        this.$router.replace(location.pathname + '?work=' + this.work.id)
      }
      Message.success('作品保存成功！')
    },

    onCommand (cmd, ...args) {
      switch (cmd) {
        case 'add-scene':
          this.scene = addScene(this.work, this.scene)
          break
        case 'next-scene':
          this.scene = nextScene(this.work, this.scene)
          break
        case 'prev-scene':
          this.scene = prevScene(this.work, this.scene)
          break
        case 'anime':
          this.drawer.elementProp = true
          this.currentElementPropEdit = 'animation'
          break
        case 'style':
          this.drawer.elementProp = true
          this.currentElementPropEdit = 'style'
          break
        case 'stager':
          this.drawer.elementProp = true
          this.currentElementPropEdit = 'stager'
          break
        case 'scene-list':
          this.drawer.sceneList = true
          break
        case 'element-list':
          this.drawer.elementList = true
        default:
          break;
      }
    },

    toggleShowDrawer (drawerName) {
      this.drawer.animation = false
      this.drawer.elementProp = false
      this.drawer.elementList = false
      this.drawer.sceneList = false
      this.drawer.workProp = false
      if (drawerName) {
        this.drawer[drawerName] = true
      }
    },

    focusChange (element) {
      if (element == null) {
        this.toggleShowDrawer()
      }
    },

    drawElement (element) {
      this.insert('element', element)
    },

    async onMounted () {
      let workId = this.$route.query.work
      if (!workId) {
        this.work = newWork({
          width: this.$route.query.width,
          height: this.$route.query.height,
        }, this.$route.query.tag)
        this.scene = addScene(this.work)
      } else {
        await this.loadWork(workId)
        this.scene = this.work.scenes[0]
      }

      // 设置保存 ctrl+s 处理
      Mousetrap.bind('ctrl+s', async ev => {
        ev.stopPropagation()
        ev.preventDefault()
        this.handleSaveWork()
      })
    },

    insert (type, object) {
      switch (type) {
        case 'scene':
          if (object == null) {
            this.addScene()
          }
          break
        case 'tick':
          this.applyTicksToWork(object)
          break
        case 'element':
          this.$refs.sceneContainer.createSingleElement(object, 100, 100)
          break
        default:
      }
    },

    replace (element) {
      if (element.url) {
        this.$refs.sceneContainer.replaceElement(element)
      } else if (element.cssContent) {
        this.$refs.sceneContainer.applyFilter(element)
      } else if (element.svg) {
      }
    },

    clean (name) {

    },

    resizeWorkViewBox () {

    },

    openPen (type) {
      this.pen = type
      this.viewPortRect.left = this.$refs.sceneContainer.translateX
      this.viewPortRect.top = this.$refs.sceneContainer.translateY
      this.viewPortRect.width = this.$refs.sceneContainer.viewPort.width
      this.viewPortRect.height = this.$refs.sceneContainer.viewPort.height
    },

    scaleChange (scale) {
      this.scale = scale
    },
    togglePaste (paste) {
      this.paste = paste
    }
  }
}
</script>

<style lang="scss">
.xd-builder {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#xd {
  @import './common.scss';
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  background-color: #f5f5f4;

  #anime-editor {
    height: 480px;
  }
  .right-section {
    position: relative;
    width: calc(100% - 460px);
    padding: 0;
    flex: 1;
    touch-action: none;
    user-select: none;
    display: flex;
    flex-direction: column;
  }
}

</style>
