<template>
<div id="animation-panel">
  <div class="panel-title">
    <div>动画列表</div>
    <div></div>
  </div>
  <div class="animation-list">
    <div v-for="(animation, index) in animations" :key="index" class="animation">
      <div class="animation-name">
        {{animation.title}}
      </div>
      <div class="duration">
        <el-slider range :step="50" v-model="animation.range" :max="6000"/>
      </div>
      <div class="icon-del">
         <el-button type="text" icon="el-icon-delete" @click="removeAnimation(index)"></el-button>
      </div>
    </div>
  </div>
  <div class="btn-bottom">
    <el-button size="mini" type="primary" @click="preview">预览</el-button>
  </div>
</div>
</template>

<script>
import { Button, Slider } from 'element-ui'

/**
 * 动画配置面板
 */
export default {
  name: 'AnimationPanel',
  components: {
    [Button.name]: Button,
    [Slider.name]: Slider
  },
  props: {
    // 触发时机，支持进入、离开等
    trigger: {
      type: String
    },
    // 动画列表
    animations: {
      type: Array
    }
  },
  methods: {
    removeAnimation (index) {
      this.animations.splice(index, 1)
      this.$emit('preview', this.trigger)
    },

    preview () {
      this.$emit('preview', this.trigger)
    }
  }
}
</script>

<style lang="scss">
#animation-panel {
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;
  padding: 0 10px;
  font-size: 12px;
  .panel-title {
    font-weight: 600;
    color:rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid #efefef;
    padding: 10px 0;
  }
  .animation-list {
    .animation {
      line-height: 38px;
      display: flex;
      .animation-name {
        width: 88px;
      }
      .duration {
        flex: 1;
      }
      .icon-del {
        width: 24px;
        text-align: right;
      }
    }
  }
  .btn-bottom {
    padding: 10px 0;
  }
}
</style>
