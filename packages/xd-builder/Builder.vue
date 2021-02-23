<template>
  <div class="xd-builder">
    <system-bar />
    <div id="xd" class="design-area">
      <left-aside />
      <section v-if="work && currentScene" class="right-section">
        <toolbar
          :work="work"
          :scene="currentScene"
          @toggle-show="toggleShowDrawer"
        />
        <scene-container
          ref="sceneContainer"
          :work="work"
          :scene="currentScene"
          @choose-scene="chooseScene"
          @scale-fit="scaleChange"
          @focus-change="focusChange"
        />
      </section>
      <el-drawer title="元素列表" destroy-on-close :visible.sync="drawer.elementList" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
        <scene-element-list :scene="currentScene" @close="toggleShowDrawer" />
      </el-drawer>
      <el-drawer title="动画设置" destroy-on-close :visible.sync="drawer.animation" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
        <frame-list-config :element="focusedElement" @close="toggleShowDrawer" />
      </el-drawer>
      <el-drawer title="场景列表" destroy-on-close :visible.sync="drawer.sceneList" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
        <scene-list :work="work" :current="currentScene" @choose-scene="chooseScene" @close="toggleShowDrawer" />
      </el-drawer>
      <el-drawer title="元素配置" destroy-on-close :visible.sync="drawer.elementProp" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
        <element-prop-config v-if="drawer.elementProp" :element="focusedElement" @close="toggleShowDrawer" />
      </el-drawer>
      <el-drawer title="作品配置" destroy-on-close :visible.sync="drawer.workProp" direction="ltr" :modal="false" size="428px" :wrapper-closable="false" :with-header="false">
        <work-config :work="work" @close="toggleShowDrawer" />
      </el-drawer>
      <div id="textMesure" />
    </div>
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
import 'element-ui/packages/theme-chalk/lib/icon.css'
import Mousetrap from 'mousetrap'
import Vue from 'vue'
import { newWork } from './utils/workActions'

import {
  Input,
  Popover,
  Tooltip,
  Form,
  FormItem,
  InputNumber,
  Checkbox,
  Slider,
  Button,
  ButtonGroup,
  Select,
  OptionGroup,
  Option,
  ColorPicker,
  Tabs,
  TabPane,
  Upload,
  Cascader,
  Pagination,
  Dialog,
  Drawer,
  Tag
} from 'element-ui'
import SystemBar from './components/SystemBar'

Vue.use(Input)
Vue.use(Button)
Vue.use(Drawer)
Vue.use(Popover)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(InputNumber)
Vue.use(ButtonGroup)
Vue.use(Select)
Vue.use(OptionGroup)
Vue.use(Option)
Vue.use(ColorPicker)
Vue.use(Tabs)
Vue.use(Upload)
Vue.use(TabPane)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Tag)

export default {
  name: 'Builder',
  components: {
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
      currentScene: null,
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
        this.addScene()
      } else {
        await this.loadWork(workId)
        this.currentScene = this.work.scenes[0]
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
