<template>
<div class="page-slide-preview">
  <div class="device" v-if="work && viewPort" :style="deviceStyle">
    <render-scene v-if="currentScene" :scene="currentScene" stage="enter" :work="work" :view-port="viewPort"/>
    <render-scene v-if="lastScene" :scene="lastScene" stage="exist" :work="work" :view-port="viewPort"/>
  </div>
  <i class="el-icon-right abs-actions" @click="nextScene"></i>
  <i class="el-icon-back abs-actions" @click="previousScene"></i>
  <div class="action-bar">
    <div class="action-button"><i class="el-icon-position" /></div>
    <div class="action-button"><i class="el-icon-full-screen" /></div>
  </div>
</div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry.js'
import { fitRectIntoBounds } from '../mixins/rectUtils.js'
import workMixin from '../work/workMixin.js'
import sceneMixin from '../mixins/sceneMixins.js'
import RenderScene from '../render/RenderScene'
export default {
  name: 'Preview',
  mixins: [ workMixin, sceneMixin ],
  components: {
    RenderScene,
  },
  data () {
    return {
      viewPort: null,
      work: null
    }
  },
  created () {
    this.ctx.styleRegistry = new StyleRegistry()
  },
  computed: {
    deviceStyle () {
      if (this.viewPort) {
        return {
          perspective: this.viewPort.width + 'px',
          width: this.viewPort.width + 'px',
          height: this.viewPort.height + 'px'
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
      this.viewPort = fitRectIntoBounds(this.work.screen, {
        width: this.$el.offsetWidth - 48,
        height: this.$el.offsetHeight - 48 - 48
      })
      this.currentScene = this.work.scenes[0]
    }
  }
}
</script>

<style lang="scss">

.page-slide-preview {
  height: 100%;
  box-sizing: border-box;
  padding: 24px 0 0 0;
  overflow: hidden;

  .abs-actions {
    position: absolute;
    font-size: 3rem;
    cursor: pointer;
    &:hover {
      color: #00bf72;
    }
    &.el-icon-right {
      right: 24px;
      top: calc(50vh - 20px);
    }
    &.el-icon-back {
      left: 24px;
      top: calc(50vh - 20px);
    }
  }

  .action-bar {
    font-size: 2rem;
    height: 48px;
    line-height: 48px;
    display: flex;
    justify-content: center;
    .action-button {
      cursor: pointer;
      margin: 0 10px;
      width: 48px;
      text-align: center;
      &:hover {
        background: #ccc;
      }
    }
  }
}
.device {
  background: #fff;
  margin: 0 auto;
  box-shadow: 0 0 0 1px rgba(14,19,24,.02), 0 2px 8px rgba(14,19,24,.15);
  border-radius: 4px;
  position: relative;
  margin-bottom: 20px;
  .scene {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
