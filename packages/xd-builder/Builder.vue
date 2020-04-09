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
      @change="workChange"
      @undo="undo"
      @redo="redo"
      @scale-change="scaleChange"
      @prev-scene="previousScene"
      @next-scene="nextScene"
      @toggle-paste="togglePaste"/>
    <scene-container
      v-if="currentScene"
      :screen="work.screen"
      :scenes="work.scenes"
      :scene="currentScene"
      :exist-scene="lastScene"
      :work="work"
      :paste="paste"
      @undo="undo"
      @change="workChange"
      @scale-fit="scaleChange"
      @clean-paste="cleanPaste"/>
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
export default {
  name: 'Builder',
  components: {
    Toolbar,
    SceneContainer,
    LeftAside
  },
  mixins: [ sceneMixin, workMixin, redoMixins],
  props: {
  },
  data () {
    return {
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
