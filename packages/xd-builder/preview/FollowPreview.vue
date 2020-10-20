<template>
  <div class="page-scene-preview">
    <div v-if="work" ref="container" class="preview-container">
      <div class="device" :style="deviceStyle">
        <render-scene :variables="variables" :scene="work.scenes[sceneIndex]" :view-port="viewPort" :view-box="work.viewBox" />
      </div>
    </div>
  </div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry.js'
import workMixin from '../mixins/workMixin.js'
import sceneMixin from '../mixins/sceneMixins.js'
import RenderScene from '../render/RenderScene'
import RestDAO from '../../utils/restdao'
export default {
  name: 'Preview',
  components: {
    RenderScene,
  },
  mixins: [ workMixin, sceneMixin ],
  data () {
    return {
      sceneIndex: 0,
      variables: [],
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
    this.followdao = new RestDAO(this.ctx, 'danke/follow')
    this.ctx.styleRegistry = new StyleRegistry(this.ctx)
  },
  mounted () {
    this.loadAndInitDevice(this.$route.params.id)
  },
  methods: {
    async loadAndInitDevice (id) {
      const follow = await this.followdao.getOne(id)
      this.variables = follow.variables
      // 加载作品
      await this.loadWork(follow.work)
      // 设置显示屏幕大小
      this.viewPort = this.work.viewBox

      this.$nextTick(() => {
        const allImgs = document.querySelectorAll('img')
        let total = allImgs.length
        let loaded = 0
        for (let img of allImgs) {
          img.onload = function () {
            loaded ++
            if (loaded === total) {
              window.avatarReady && window.avatarReady()
            }
          }
        }
      })
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
