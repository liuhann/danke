<template>
  <div class="page-avatar-preview">
    <div v-if="work && viewPort" class="preview-container">
      <div class="device" :style="deviceStyle">
        <render-scene v-show="!playing && !playend" :scene="work.scenes[0]" stage="enter" :view-port="viewPort" :view-box="work.viewBox" />
        <render-scene v-for="(scene, index) in work.scenes" v-show="scene.visible" :key="index" :scene="scene" :stage="scene.stage" :view-port="viewPort" :view-box="work.viewBox" />
      </div>
    </div>
    <div v-if="work && viewPort" class="action" :style="actionStyle">
      <i v-if="currentSceneIndex > 0 && !currentAutoPlay" class="el-icon-right next-scene" @click="enterScene(currentSceneIndex + 1)" />
      <i v-if="(currentSceneIndex < work.scenes.length - 1) && !currentAutoPlay" class="el-icon-back prev-scene" @click="enterScene(currentSceneIndex - 1)" />
      <i class="el-icon-video-play play" @click="play" />
    </div>
    <div class="seconds">
      {{ currentSecondsFormated }}
    </div>
  </div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry.js'
import { fitRectIntoBounds } from '../mixins/rectUtils.js'
import workMixin from '../mixins/workMixin.js'
import sceneMixin from '../mixins/sceneMixins.js'
import RenderScene from '../render/RenderScene'
import RestDAO from '../../utils/restdao.js'
export default {
  name: 'AvatarPreview',
  components: {
    RenderScene,
  },
  mixins: [ workMixin, sceneMixin ],
  data () {
    return {
      viewPort: {
        width: 640,
        height: 640
      },
      work: null
    }
  },
  computed: {
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.ctx.styleRegistry = new StyleRegistry(this.ctx)
  },
  mounted () {
    let workId = this.$route.query.work
  },
  methods: {
    async loadAndInitDevice (workId) {
      // 加载作品
      await this.loadWork(workId)
    },
  }
}
</script>

<style lang="scss">
.page-avatar-preview {

}
</style>
