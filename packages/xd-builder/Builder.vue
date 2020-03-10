<template>
<div id="xd">
  <left-aside @insert="insert"/>
  <section class="right-section">
    <toolbar v-if="scene" :scenes="work.scenes" :work="work" :scene="scene" @scale-change="scaleChange" @prev-scene="previousScene" @next-scene="nextScene"/>
    <scene-container v-if="scene" :screen="work.screen" :scenes="work.scenes" :scene="scene" :exist-scene="existScene" :scale="scale"/>
  </section>
</div>
</template>

<script>
import StyleRegistry from './utils/StyleRegistry.js'
import workMixin from './work/workMixin.js'
import sceneMixin from './mixins/sceneMixins.js'
import { Popover, Button, Upload, Tabs, TabPane, Drawer, Dialog, Menu, MenuItem, Message, Loading } from 'element-ui'
import SceneContainer from './SceneContainer.vue'
import LeftAside from './left/LeftAside.vue'
import 'element-ui/packages/theme-chalk/lib/icon.css'
import { shortid } from '../utils/string'
import Toolbar from './toolbar/Toolbar'
export default {
  name: 'Builder',
  components: {
    Toolbar,
    SceneContainer,
    LeftAside,
    [Popover.name]: Popover,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Upload.name]: Upload,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Drawer.name]: Drawer,
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem
  },
  mixins: [ sceneMixin, workMixin ],
  props: {
  },
  data () {
    return {
      // 作品概要信息
      work: {
        id: '', // 随机生成的id数
        title: '', // 名称 暂时保留使用
        screen: { // 定义时的屏幕大小
          width: 0,
          height: 0
        },
        style: {},
        scenes: [] // 场景列表
      },
      existScene: null,
      scene: null,
      scale: 1
    }
  },

  created () { },

  mounted () {
    this.ctx.styleRegistry = new StyleRegistry()
    let workId = this.$route.query.work
    if (!workId) {
      this.newWork()
    } else {
      this.loadWork(workId)
    }
    setInterval(() => {
      this.saveWork()
    }, 3000)
  },
  methods: {
    /**
     * 新增作品
     */
    newWork () {
      this.work.screen = {
        width: parseInt(this.$route.query.width) || 414,
        height: parseInt(this.$route.query.height) || 896
      }
      this.work.id = shortid()
      this.work.title = '我的作品'
      this.addEmptyScene()
    },

    /**
     * 增加新的场景
     */
    addEmptyScene () {
      const scene = {
        id: shortid(),
        elements: [],
        style: {},
        z: 100
      }
      this.work.scenes.splice(this.sceneIndex + 1, 0, scene)
      this.scene = scene
    },

    insert (type, object) {
      switch (type) {
        case 'scene':
          if (object == null) {
            this.addEmptyScene()
          }
          break;
        default:
      }
    },
    previousScene () {
      const currentIndex = this.work.scenes.indexOf(this.scene)
      if (currentIndex === 0) {
        return
      }
      this.existScene = this.scene
      this.scene = this.work.scenes[currentIndex - 1]
    },

    nextScene () {
      const currentIndex = this.work.scenes.indexOf(this.scene)
      if (currentIndex === this.work.scenes.length - 1) {
        return
      }
      this.existScene = this.scene
      this.scene = this.work.scenes[currentIndex + 1]
    },
    scaleChange (scale) {
      this.scale = scale
    }

  }
}
</script>

<style lang="scss">
#xd {
  @import './common.scss';
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  background-color: #f5f5f4;

  .right-section {
    padding: 0;
    flex: 1;
    touch-action: none;
    user-select: none;
    display: flex;
    flex-direction: column;
  }
}

</style>
