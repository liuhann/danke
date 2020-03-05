<template>
<div id="xd">
  <left-aside @insert="insert"/>
  <section class="right-section">
    <toolbar :scenes="work.scenes" :scene="scene" @scale-change="scaleChange"/>
    <scene-container :screen="work.screen" :scenes="work.scenes" :scene="scene" :scale="scale"/>
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

    /**
    * 保存作品内容
    */
    async saveWork () {
      if (this.savingWork) {
        return
      }
      this.savingWork = true
      const loading = Loading.service({
        lock: true,
        text: '正在保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.4)'
      })
      const work = JSON.parse(JSON.stringify(this.work))
      // 抽取所有使用的frame style到work上，以便压缩使用空间
      Object.assign(work, this.ctx.styleRegistry.getStyleResource(work))
      if (!this.work._id) {
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
      } else {
        await this.workdao.patch(work._id, work)
      }
      loading.close()
      Message.success('保存完成')
      this.savingWork = false
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
