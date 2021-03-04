<template>
  <div class="xd-builder">
    <system-bar @command="handleSystemBarCommand" />
    <div id="xd" class="design-area">
      <left-aside />
      <section v-if="work && scene" class="right-section">
        <toolbar :work="work" :scene="scene" @command="onCommand" />
        <scene-container :work="work" :scene="scene" />
      </section>
    </div>

    <div id="pop-editors">
    </div>
    <el-drawer title="元素列表" destroy-on-close :visible.sync="drawer.elementList" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
      <scene-element-list :scene="scene" @close="toggleShowDrawer" />
    </el-drawer>

    <pop-element-anime :visible.sync="drawer.animation" :elements="selectedElements" />

    <el-drawer title="场景列表" destroy-on-close :visible.sync="drawer.sceneList" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
      <scene-list :work="work" :current="scene" @choose-scene="chooseScene" @close="toggleShowDrawer" />
    </el-drawer>
    <el-drawer title="元素配置" destroy-on-close :visible.sync="drawer.elementProp" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
      <element-prop-config v-if="drawer.elementProp" :element="focusedElement" @close="toggleShowDrawer" />
    </el-drawer>
    <el-drawer title="作品配置" destroy-on-close :visible.sync="drawer.workProp" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
      <work-config :work="work" @close="toggleShowDrawer" />
    </el-drawer>
    <div id="textMesure" />
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
import ElementPropConfig from './left/ElementPropConfig.vue'
import WorkConfig from './left/WorkConfig.vue'
import './import-element-ui.js'
import Mousetrap from 'mousetrap'

import { newWork, addScene, nextScene, prevScene, saveWork } from './utils/workActions'

import SystemBar from './components/SystemBar'
import PopElementAnime from './components/PopElementAnime'

export default {
  name: 'Builder',
  components: {
    PopElementAnime,
    SystemBar,
    ElementPropConfig,
    SceneList,
    Toolbar,
    SceneContainer,
    SceneElementList,
    FrameListConfig,
    LeftAside,
    WorkConfig
  },
  mixins: [ sceneMixin, workMixin ],
  props: {
  },
  data () {
    return {
      drawer: {
        animation: false,
        elementProp: false,
        elementList: false,
        sceneList: false,
        workProp: false
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
          this.work = await saveWork(this.work, this.ctx)
          this.$router.replace(location.pathname + '?work=' + this.work.id)
          break;
        default:
          break;
      }
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
          this.editAnimation(...args)
          break
        default:
          break;
      }
    },

    editAnimation (components) {
      this.drawer.animation = true

      this.$nextTick(() => {

      })
    },
    confirmAnime () {

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
          height: this.$route.query.height
        })
        this.scene = addScene(this.work)

      } else {
        await this.loadWork(workId)
        this.scene = this.work.scenes[0]
      }

      // 设置保存 ctrl+s 处理
      Mousetrap.bind('ctrl+s', ev => {
        ev.stopPropagation()
        ev.preventDefault()
        this.saveWork()
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
#textMesure {
  position: absolute;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: nowrap; /* Thanks to Herb Caudill comment */
}

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
