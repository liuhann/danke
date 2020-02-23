<template>
<div id="xd">
  <left-aside @insert="insert"/>
  <scene-container :scene="currentScene" :screen="work.screen" :scenes="work.scenes"
    @prev-scene="previousScene"
    @next-scene="nextScene"
    @save-work="saveWork"
    @play-work="runWork"/>
</div>
</template>

<script type="module">
import StyleRegistry from './utils/StyleRegistry.js'
import workMixin from './work/workMixin.js'
import sceneMixin from './scene/sceneMixins.js'
import { Popover, Button, Upload, Tabs, TabPane, Drawer, Dialog, Menu, MenuItem, Message, Loading } from 'element-ui'
import SceneContainer from './SceneContainer.vue'
import LeftAside from './LeftAside.vue'
import 'element-ui/packages/theme-chalk/lib/icon.css'
export default {
  name: 'Builder',
  components: {
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
      currentScene: null
    }
  },

  created () { },

  mounted () {
    this.ctx.styleRegistry = new StyleRegistry()
    let workId = this.$route.query.work
    if (!workId) {
      this.newWork()
      this.addNewScene()
    } else {
      this.loadWork(workId)
      this.chooseScene(this.work.scenes[0])
    }
  },
  methods: {
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

    runWork () {

    },

    /**
     * 响应popup 插入相关场景、元素等
     * @param type
     * @param data
     */
    insert (type, data) {
      switch (type) {
        case 'scene':
          if (data == null) {
            this.addNewScene()
          } else {
            this.cloneScene(data)
          }
          break
        case 'image':
          this.insertRawImage(data)
          break
        case 'svg':
          this.insertSVGImage(data.svg, data.desc)
          break
        case 'back-audio':
          this.openAudioDialog()
          break
        case 'text':
          this.insertText()
          break
        case 'block':
          this.insertBlock(data)
          break
        case 'shape':
          this.insertShape()
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
#xd {
  @import './common.scss';
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  background-color: #f5f5f4;

  // 编辑容器
  section.scene-container {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    .device {
      touch-action: none;
      position: absolute;
      border: 1px solid #eee;
      border-radius: 5px;
      top: 5px;
      z-index: 10;
      overflow: hidden;
      perspective: 500px;
      box-shadow: 0px 0px 0px 1px #e6e6e6;
      .btn-audio {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 9999;
      }

      .mask {
        z-index: 999;
        border: 2px dashed #87b1f1;
        box-sizing: border-box;
        .corner-rb {
          display: none;
          background-color: #87b1f1;
          position: absolute;
          right: 0;
          bottom: 0;
          width: 10px;
          height: 10px;
        }
      }
      .element {
        position: absolute;
        &.selected {
          overflow: visible;
        }
        &.type1 {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &.type2 {
          display: flex;
          align-items: center;
          span {
            width: 100%;
          }
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &.hidden {
          display: none;
        }
        &.current {
          outline: 2px dashed #87b1f1;
          outline-offset: 0;
          z-index: 9999;
        }
        span.content-editable {
          outline:none;
          -webkit-user-modify: read-write-plaintext-only;
        }
      }

      .ti {
        position: absolute;
        background-color: #0a0a0a;
        left: -30px;
        width: 30px;
        height: 30px;
      }
    }
  }
  .welcome {
    position: absolute;
    left: 48px;
    top: 40px;
    bottom: 0;
    right: 0;
    overflow: auto;
  }
  .aside {
    overflow: auto;
    position: absolute;
    right: 0;
    top: 5px;
    width: 320px;
    bottom: 0;
    background-color: #fff;
  }
}

@media screen and (max-width: 1080px) {
  #xd .scene-container {
    top: 0;
    bottom: 0;
    right: 0;
  }
}

.line {
  margin: 5px 0;
  height: 4px;
  background: repeating-linear-gradient(to right, red 0, red 5px, transparent 5px, transparent 7px);
  /*5px red then 2px transparent -> repeat this!*/
  background-size: 100% 1px;
  background-repeat: no-repeat;
}

.slide-left-enter-active, .slide-left-leave-active {
transition: transform .2s ease-out;
}
.slide-left-enter, .slide-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
transform: translateX(-100%)
}
</style>
