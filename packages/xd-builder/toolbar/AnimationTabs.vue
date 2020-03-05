<template>
<div id="animation-config-tab">
  <tabs v-model="stage">
    <tab-pane label="进入" name="enter" class="animation-list" type="card" :style="{ height: tabHeight + 'px' }">
      <div class="enter-animations">
        <div v-for="(animation, index) in enterAnimations" :key="index" class="animation">
          <div class="animation-name">
            {{animation.title}}
          </div>
          <div class="duration">
            <slider range :step="50" v-model="animation.range" :max="6000"/>
          </div>
          <div class="icon-del">
            <el-button icon="el-icon-delete" type="text" size="mini"></el-button>
          </div>
        </div>
      </div>
      <animation-list @input="addAnimation('enters', $event)" type="enter"/>
    </tab-pane>
    <tab-pane label="离开" name="exists">
      <animation-list @input="addAnimation" type="exists"/>
    </tab-pane>
  </tabs>
</div>
</template>

<script>
import AnimationList from './AnimationList.vue'
import { TabPane, Tabs, Slider, Button } from 'element-ui'
export default {
  name: 'AnimationTabs',
  props: {
    elements: {
      type: Array
    }
  },
  components: {
    [Button.name]: Button,
    AnimationList,
    Slider,
    TabPane,
    Tabs
  },
  data () {
    return {
      tabHeight: 400,
      stage: 'enter'
    }
  },
  computed: {
    enterAnimations () {
      if (this.elements && this.elements.length) {
        return this.elements[0].style.enters || []
      } else {
        return []
      }
    }
  },
  created () {
  },
  mounted () {
    this.tabHeight = window.innerHeight - 150
  },
  methods: {
    // 增加动画
    addAnimation (type, animation) {
      const info = {
        // 名称，供配置展示用
        title: animation.title,
        // css类名称
        name: animation.name,
        // 过渡函数，默认不许修改
        timing: animation.timing,
        // 时间区间 [0]为延迟，[1]为持续时间
        range: [0, parseInt(animation.duration)]
      }
      // 给选中的元素增加动画
      if (this.elements && this.elements.length) {
        for (let element of this.elements) {
          this.$set(element.style, type, [info])
          this.$set(element, 'animations', [info])
        }
      }
    }
  }
}
</script>

<style lang="scss">
#animation-config-tab {
  overflow: auto;
  .el-pagination {
    margin: 15px 0;
  }
  .enter-animations {
    width: 100%;
  }
  .animation-list {
    .animation {
      line-height: 38px;
      display: flex;
      .animation-name {
        width: 100px;
      }
      .duration {
        flex: 1;
      }
      .icon-del {
        width: 36px;
        text-align: right;
      }
    }
  }
}
</style>
