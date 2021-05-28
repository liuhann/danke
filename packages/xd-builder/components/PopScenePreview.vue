<template>
  <el-dialog 
    id="pop-scene-preview"
    title="播放预览"
    fullscreen
    modal
    :close-on-click-modal="false"
    :visible="visible"
    @opened="opened" 
  >
    <div ref="scene-container" class="scene-container">
      <render-scene v-if="playingScene" :scene="playingScene" :view-port="viewPort" :view-box="viewBox" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="replay">重播</el-button>
      <el-button type="primary" @click="$emit('update:visible', false)">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fitRectIntoBounds } from '../mixins/rectUtils';
import RenderScene from '../render/RenderScene.vue'

export default {
  name: "PopScenePreview",
  components: {
    RenderScene
  },
  props: {
    visible: {
      type: Boolean
    },
    viewBox: {
      type: Object
    },
    scene: {
      type: Object
    }
  },

  data () {
    return {
      viewPort: null,
      playingScene: null
    }
  },

  watch: {
  },

  mounted () {

  },

  methods: {
    opened () {
      const rect = this.$refs["scene-container"].getBoundingClientRect();
      this.viewPort = fitRectIntoBounds(this.viewBox, rect);
      this.replay()
    },
    replay () {
      this.playingScene = JSON.parse(JSON.stringify(this.scene));
      this.playingScene.play = false

      this.$nextTick(() => {
        this.playingScene.play = true
      })
    }
  }
}
</script>

<style lang="scss">
#pop-scene-preview {
  .el-dialog.is-fullscreen {
    display: flex;
    flex-direction: column;

    .scene-container {
      width: 100%; 
      height: 100%; 
      display: flex; 
      justify-content: center; 
      align-items: center;

      .scene {
        overflow: hidden;
        background: #FFF;
      }
    }
    .el-dialog__body {
      background: #f5f5f4;
      flex: 1;
    }
  }
}

</style>