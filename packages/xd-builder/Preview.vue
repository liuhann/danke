<template>
<div class="preview-container">
  <div class="device" v-if="work" :style="deviceStyle">
    <div class="scene" v-for="scene of work.scenes" :key="scene.id">
      <render-element v-for="element of scene.elements" :key="element.id" :element="element" :screen="deviceSize">
      </render-element>
    </div>
  </div>
  <div class="loading" v-if="!work">
  </div>
</div>
</template>

<script>
import StyleRegistry from './utils/StyleRegistry.js'
import { fitRectIntoBounds } from './mixins/rectUtils.js'
import workMixin from './work/workMixin.js'
import sceneMixin from './scene/sceneMixins.js'
import RenderElement from './RenderElement.vue'
export default {
  name: 'Preview',
  mixins: [ workMixin, sceneMixin ],
  components: {
    RenderElement
  },
  data () {
    return {
      deviceSize: null,
      work: null
    }
  },
  created () {
    this.ctx.styleRegistry = new StyleRegistry()
  },
  computed: {
    deviceStyle () {
      if (this.deviceSize) {
        return {
          width: this.deviceSize.width + 'px',
          height: this.deviceSize.height + 'px'
        }
      } else {
        return {
          width: '640px',
          height: '320px'
        }
      }
    }
  },
  mounted () {
    let workId = this.$route.query.work
    this.loadAndInitDevice(workId)
  },
  methods: {
    async loadAndInitDevice (workId) {
      // 加载作品
      await this.loadWork(workId)
      // 设置显示屏幕大小
      this.deviceSize = fitRectIntoBounds(this.work.screen, {
        width: this.$el.offsetWidth - 20,
        height: this.$el.offsetHeight - 20
      })
    }
  }
}
</script>

<style lang="scss">

.preview-container {
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(235deg, #FFFFFF 0%, #000F25 100%), linear-gradient(180deg, #6100FF 0%, #000000 100%), linear-gradient(235deg, #FFA3AC 0%, #FFA3AC 40%, #00043C calc(40% + 1px), #00043C 60%, #005D6C calc(60% + 1px), #005D6C 70%, #00C9B1 calc(70% + 1px), #00C9B1 100%), linear-gradient(125deg, #FFA3AC 0%, #FFA3AC 40%, #00043C calc(40% + 1px), #00043C 60%, #005D6C calc(60% + 1px), #005D6C 70%, #00C9B1 calc(70% + 1px), #00C9B1 100%);
  background-blend-mode: soft-light, screen, darken, normal;
}

.device {
  background: #fff;
  .scene {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
