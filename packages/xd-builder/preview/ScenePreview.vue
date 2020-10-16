<template>
  <div class="page-scene-preview">
    <div v-if="work" class="preview-container">
      <div class="device" :style="deviceStyle">
        <render-scene :scene="work.scenes[sceneIndex]" :view-port="viewPort" :view-box="work.viewBox" />
      </div>
    </div>
  </div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry.js'
import workMixin from '../mixins/workMixin.js'
import sceneMixin from '../mixins/sceneMixins.js'
import RenderScene from '../render/RenderScene'
export default {
  name: 'Preview',
  components: {
    RenderScene,
  },
  mixins: [ workMixin, sceneMixin ],
  data () {
    return {
      sceneIndex: 0,
      viewPort: {
        width: 100,
        height: 100,
      },
      work: null
    }
  },
  computed: {
    deviceStyle () {
      return {
        width: this.viewPort.width + 'px',
        height: this.viewPort.height + 'px'
      }
    }
  },
  created () {
    this.ctx.styleRegistry = new StyleRegistry(this.ctx)
  },
  mounted () {
    this.loadAndInitDevice(this.$route.params.work)
  },
  methods: {
    async loadAndInitDevice (workId) {
      // 加载作品
      await this.loadWork(workId)
      // 设置显示屏幕大小
      this.viewPort = this.work.viewBox
    }
  }
}
</script>

<style lang="scss">
.page-scene-preview {
  .device {
    overflow: hidden;
  }
}
</style>
