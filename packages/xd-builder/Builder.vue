<template>
<div id="xd">
  <left-aside @insert="insert"/>
  <section class="right-section" v-if="work">
    <toolbar v-if="currentScene" :scenes="work.scenes" :work="work" :scene="currentScene" @scale-change="scaleChange" @prev-scene="previousScene" @next-scene="nextScene"/>
    <scene-container v-if="currentScene" :screen="work.screen" :scenes="work.scenes" :scene="currentScene" :exist-scene="lastScene" :scale="scale"/>
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
      scale: 1
    }
  },

  created () { },

  mounted () {
    this.ctx.styleRegistry = new StyleRegistry()
    this.onMounted()
  },
  methods: {
    async onMounted () {
      let workId = this.$route.query.work
      if (!workId) {
        this.newWork()
        this.addScene()
      } else {
        await this.loadWork(workId)
        this.currentScene = this.work.scenes[0]
      }
      setInterval(() => {
        this.saveWork()
      }, 3000)
    },

    insert (type, object) {
      switch (type) {
        case 'scene':
          if (object == null) {
            this.addScene()
          }
          break;
        default:
      }
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
