<template>
<div id="xd">
  <left-aside @insert="insert"/>
  <section class="right-section" v-if="work">
    <toolbar
      v-if="currentScene"
      :scenes="work.scenes"
      :work="work"
      :scene="currentScene"
      :paste="paste"
      :scale="scale"
      :undoable="undoable"
      :redoable="redoable"
      @open-pen="openPen"
      @change="workChange"
      @undo="undo"
      @redo="redo"
      @refresh="refreshScene"
      @scale-change="scaleChange"
      @prev-scene="previousScene"
      @next-scene="nextScene"
      @toggle-paste="togglePaste"/>
    <scene-container
      ref="sceneContainer"
      v-if="currentScene"
      :animation="currentAnimation"
      :view-box="work.viewBox"
      :scenes="work.scenes"
      :scene="currentScene"
      :exist-scene="lastScene"
      :work="work"
      :paste="paste"
      @undo="undo"
      @change="workChange"
      @scale-fit="scaleChange"
      @clean-paste="cleanPaste"/>
    <clippath-editor @close="isPen = false" @input="pathConfirmed" :view-port-rect="viewPortRect" :scene="currentScene" :view-box="work.viewBox" :work="work" v-if="isPen"/>
  </section>
  <div id="textMesure"></div>
</div>
</template>

<script>
import StyleRegistry from './utils/StyleRegistry.js'
import workMixin from './work/workMixin.js'
import sceneMixin from './mixins/sceneMixins.js'
import redoMixins from './work/redoMixins'
import SceneContainer from './SceneContainer.vue'
import LeftAside from './left/LeftAside.vue'
import 'element-ui/packages/theme-chalk/lib/icon.css'
import Toolbar from './toolbar/Toolbar'
import { shortid } from '../utils/string'
import ClippathEditor from './clippath-maker/ClippathEditor'
export default {
  name: 'Builder',
  components: {
    ClippathEditor,
    Toolbar,
    SceneContainer,
    LeftAside
  },
  mixins: [ sceneMixin, workMixin, redoMixins],
  props: {
  },
  data () {
    return {
      viewPortRect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      isPen: false,
      work: null,
      currentAnimation: null,
      scale: 1,
      paste: null
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
        this.takeSnapshot()
      } else {
        await this.loadWork(workId)
        this.currentScene = this.work.scenes[0]
        this.takeSnapshot()
      }
      // setInterval(() => {
      //   this.saveWork()
      // }, 3000)
    },

    insert (type, object) {
      switch (type) {
        case 'scene':
          if (object == null) {
            this.addScene()
          }
          break;
        case 'animation':
          this.currentAnimation = object
        case 'element':
          this.$refs.sceneContainer.createSingleElement(object, (this.work.viewBox.width - object.path.w) / 2, (this.work.viewBox.height - object.path.h) / 2)
          // this.currentScene.elements.push(Object.assign(node, object))
        default:
      }
    },

    pathConfirmed (object) {
      console.log('insert path', object)
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
      this.isPen = false
    },

    refreshScene () {
      let current = this.currentScene
      this.currentScene = {
        id: shortid(),
        elements: [],
        animation: {},
        z: 100
      }

      this.$nextTick(() => {
        this.currentScene = current
      })
    },

    openPen () {
      this.isPen = true
      this.viewPortRect.left = this.$refs.sceneContainer.translateX
      this.viewPortRect.top = this.$refs.sceneContainer.translateY
      this.viewPortRect.width = this.$refs.sceneContainer.viewPort.width
      this.viewPortRect.height = this.$refs.sceneContainer.viewPort.height
    },

    workChange () {
      this.takeSnapshot()
    },
    scaleChange (scale) {
      this.scale = scale
    },
    togglePaste (paste) {
      this.paste = paste
    },
    cleanPaste () {
      this.paste = null
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
