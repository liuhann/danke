<template>
<div class="page-slide-preview">
  <div class="device" v-if="work && deviceSize" :style="deviceStyle">
    <div class="scene" v-for="scene of work.scenes" :key="scene.id">
      <render-element v-for="element of scene.elements" :work-screen="work.screen"  :key="element.id" :element="element" :screen="deviceSize">
      </render-element>
    </div>
  </div>
  <div class="action-bar">
    <div class="action-button">分享</div>
    <div class="action-button">全屏</div>
  </div>
</div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry.js'
import { fitRectIntoBounds } from '../mixins/rectUtils.js'
import workMixin from '../work/workMixin.js'
import sceneMixin from '../mixins/sceneMixins.js'
import RenderElement from '../render/RenderElement.vue'
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
    let workId = this.$route.query.work || this.$route.params.work
    this.loadAndInitDevice(workId)
  },
  methods: {
    async loadAndInitDevice (workId) {
      // 加载作品
      await this.loadWork(workId)
      // 设置显示屏幕大小
      this.deviceSize = fitRectIntoBounds(this.work.screen, {
        width: this.$el.offsetWidth - 48,
        height: this.$el.offsetHeight - 48 - 48
      })
    }
  }
}
</script>

<style lang="scss">

.page-slide-preview {
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  overflow: hidden;

  .action-bar {
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    display: flex;
    justify-content: center;
    .action-button {
      margin: 0 20px;
    }
  }
}
.device {
  background: #fff;
  margin: 0 auto;
  box-shadow: 0 0 0 1px rgba(14,19,24,.02), 0 2px 8px rgba(14,19,24,.15);
  border-radius: 4px;
  position: relative;
  .scene {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
