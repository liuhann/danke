<template>
  <div id="xd">
    <left-aside @insert="insert" @replace="replace" />
    <section v-if="work" class="right-section">
      <toolbar
        :work="work"
        :scene="currentScene"
        @show-elements="showElementList"
        @show-animations="showAnimationDrawer"
      />
      <scene-container
        ref="sceneContainer"
        :scene="currentScene"
        :work="work"
        @toggle-scenes="showSceneList = true"
        @scale-fit="scaleChange"
        @focus-change="focusChange"
      />
      <clippath-editor v-if="pen" :view-port-rect="viewPortRect" :scene="currentScene" :view-box="work.viewBox" :work="work" @close="pen = ''" @input="pathConfirmed" />
      <scene-list v-show="showSceneList" :work="work" :current="currentScene" @close="showSceneList = false" @choose-scene="chooseScene" />
    </section>
    <el-drawer title="元素列表" :visible.sync="elementsDrawer" direction="ltr" :modal="false" size="428px" :wrapper-closable="false">
      <scene-element-list :scene="currentScene" />
    </el-drawer>
    <el-drawer title="动画设置" :visible.sync="animationDrawer" direction="ltr" :modal="false" size="428px" :wrapper-closable="false">
      <frame-list-config :work="work" :scene="currentScene" />
    </el-drawer> 
    <div id="textMesure" />
  </div>
</template>

<script>
import StyleRegistry from './utils/StyleRegistry.js'
import workMixin from './work/workMixin.js'
import sceneMixin from './mixins/sceneMixins.js'
import SceneContainer from './SceneContainer.vue'
import LeftAside from './left/LeftAside.vue'
import Toolbar from './toolbar/Toolbar.vue'
import { shortid } from '../utils/string'
import ClippathEditor from './clippath-maker/ClippathEditor'
import SceneList from './SceneList.vue'
import SceneElementList from './left/SceneElementList.vue'
import FrameListConfig from './left/FrameListConfig.vue'
import 'element-ui/packages/theme-chalk/lib/icon.css'
import Mousetrap from 'mousetrap'
import Vue from 'vue'

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
  Drawer
} from 'element-ui'

Vue.use(Input)
Vue.use(Button)
Vue.use(Drawer)
Vue.use(Popover)
Vue.use(Pagination)

export default {
  name: 'Builder',
  components: {
    SceneList,
    ClippathEditor,
    Toolbar,
    SceneContainer,
    SceneElementList,
    FrameListConfig,
    LeftAside
  },
  mixins: [ sceneMixin, workMixin ],
  props: {
  },
  data () {
    return {
      elementsDrawer: false,
      animationDrawer: false,
      viewPortRect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      pen: '',
      work: null,
      showSceneList: false,
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
    showElementList () {
      this.elementsDrawer = true
    },

    focusChange (element) {
      if (element == null) {
        // close drawer on click empty
        this.elementsDrawer = false
        this.animationDrawer = false
      }
    },

    showAnimationDrawer () {
      this.animationDrawer = true
    },

    drawElement (element) {
      this.insert('element', element)
    },
    async onMounted () {
      let workId = this.$route.query.work
      if (!workId) {
        this.newWork()
        this.addScene()
      } else {
        await this.loadWork(workId)
        this.currentScene = this.work.scenes[0]
      }
      this.ctx.styleRegistry.loadAllFrames()

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
      }
    },

    pathConfirmed (object) {
      this.$refs.sceneContainer.createSingleElement({
        variables: [{
          name: 'fill',
          value: object.color,
          type: 'color'
        }, {
          name: 'stokeWidth',
          value: object.strokeWidth,
          type: 'px'
        }, {
          name: 'stroke',
          value: object.strokeColor,
          type: 'color'
        }],
        path: {
          w: object.w,
          h: object.h,
          points: object.points
        },
        x: object.x / this.scale,
        y: object.y / this.scale,
        width: object.w / this.scale,
        height: object.h / this.scale
      })
      this.pen = ''
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

#xd {
  @import './common.scss';
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
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
