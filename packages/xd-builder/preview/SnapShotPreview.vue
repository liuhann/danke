<template>
  <div class="page-snap-preview">
    <div v-if="work" ref="container" class="preview-container">
      <div class="device" :style="deviceStyle">
        <render-scene :variables="work.variables" :scene="work.scenes[sceneIndex]" :view-port="work.viewBox" :view-box="work.viewBox" />
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
  name: 'SnapShotPreview',
  components: {
    RenderScene,
  },
  mixins: [ workMixin, sceneMixin ],
  data () {
    return {
      sceneIndex: 0,
      variables: [],
      work: null
    }
  },
  computed: {
    deviceStyle () {
      return {
        width: this.work.viewBox.width + 'px',
        height: this.work.viewBox.height + 'px'
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.ctx.styleRegistry = new StyleRegistry(this.ctx)
  },
  mounted () {
    this.loadAndInitDevice(this.$route.params.id)
  },
  methods: {
    async loadAndInitDevice (id) {
      await this.loadWork(id)
      this.variables = this.work.variables
      // 设置显示屏幕大小
      this.viewPort = this.work.viewBox

      this.$nextTick(() => {
        const allImgs = document.querySelectorAll('img')
        let total = allImgs.length
        if (total === 0) {
          window.avatarReady && window.avatarReady()
        } else {
          let loaded = 0
          for (let img of allImgs) {
            img.onload = function () {
              loaded ++
              if (loaded === total) {
                window.avatarReady && window.avatarReady()
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.page-snap-preview {
  .device {
    overflow: hidden;
  }
}
</style>
