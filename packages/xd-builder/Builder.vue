<template>
  <div id="xd">
    <left-aside @insert="insert" @replace="replace" />
    <section v-if="work" class="right-section">
      <toolbar
        v-if="currentScene"
        :scenes="work.scenes"
        :work="work"
        :scene="currentScene"
        :paste="paste"
        :scale="scale"
        :undoable="undoable"
        :redoable="redoable"
        @draw="drawElement"
        @open-pen="openPen"
        @change="workChange"
        @undo="undo"
        @redo="redo"
        @scale-change="scaleChange"
        @prev-scene="previousScene"
        @next-scene="nextScene"
        @toggle-paste="togglePaste"
      />
      <scene-container
        v-if="currentScene"
        ref="sceneContainer"
        :animation="currentAnimation"
        :view-box="work.viewBox"
        :scene="currentScene"
        :exist-scene="lastScene"
        :work="work"
        :paste="paste"
        @undo="undo"
        @toggle-scenes="showSceneList = true"
        @save-work="saveWork"
        @change="workChange"
        @scale-fit="scaleChange"
        @clean-paste="cleanPaste"
      />
      <clippath-editor v-if="pen" :view-port-rect="viewPortRect" :scene="currentScene" :view-box="work.viewBox" :work="work" @close="pen = ''" @input="pathConfirmed" />
      <scene-list v-show="showSceneList" :work="work" :current="currentScene" @close="showSceneList = false" @choose-scene="chooseScene" />
    </section>
    <div id="textMesure" />
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
import SceneList from './SceneList'
export default {
  name: 'Builder',
  components: {
    SceneList,
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
      pen: '',
      work: null,
      currentAnimation: null,
      showSceneList: false,
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
    drawElement (element) {
      this.insert('element', element)
    },
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
          this.$refs.sceneContainer.createSingleElement(object, 100, 100)
          // this.currentScene.elements.push(Object.assign(node, object))
        default:
      }
    },

    replace (element) {
      if (element.url) {
        this.$refs.sceneContainer.replaceElement(element)
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
