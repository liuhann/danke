<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  width="360"
  trigger="click">
  <a class="action" slot="reference" title="特效"><i class="el-icon-magic-stick"></i></a>
  <div id="animation-config-tab">
    <tabs v-model="stage">
      <tab-pane label="进入" name="enter" class="animation-list">
        <table class="selected-animations">
          <tr>
            <td>名称</td>
            <td>延迟(ms)</td>
            <td>持续(ms)</td>
            <td></td>
          </tr>
          <tr v-for="(animation, index) in enterAnimations" :key="index" class="animation">
            <td>{{animation.title}}</td>
            <td><el-input-number v-model="animation.range[0]" size="mini" controls-position="right" :step="50"></el-input-number></td>
            <td><el-input-number v-model="animation.range[1]" size="mini" controls-position="right" :step="50"></el-input-number></td>
            <td><el-button icon="el-icon-delete" type="text" size="mini"></el-button></td>
          </tr>
        </table>
        <animation-list @input="addAnimation('enters', $event)" :type="elementType"/>
      </tab-pane>
      <tab-pane label="离开" name="exists">
        <div class="selected-animations">
          <div v-for="(animation, index) in existAnimations" :key="index" class="animation">
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
        <animation-list @input="addAnimation('exists', $event)" type="exist"/>
      </tab-pane>
    </tabs>
  </div>
</el-popover>


</template>

<script>
import AnimationList from './AnimationList.vue'
import { TabPane, Tabs, Slider, Button, Popover, InputNumber } from 'element-ui'
export default {
  name: 'PopSetAnimation',
  props: {
    elements: {
      type: Array
    },
    scene: {
      type: Object
    }
  },
  components: {
    [InputNumber.name]: InputNumber,
    [Popover.name]: Popover,
    [Button.name]: Button,
    AnimationList,
    Slider,
    TabPane,
    Tabs
  },
  data () {
    return {
      stage: 'enter'
    }
  },
  computed: {
    elementType () {
      if (this.elements && this.elements.length) {
        if (this.elements[0].text != null) {
          return 'text'
        } else {
          return  'enter'
        }
      } else {
        return 'enter'
      }
    },
    enterAnimations () {
      if (this.elements && this.elements.length) {
        return this.elements[0].animation.enters || []
      } else if (this.scene) {
        return this.scene.animation.enters
      } else {
        return []
      }
    },
    existAnimations () {
      if (this.elements && this.elements.length) {
        return this.elements[0].animation.exists || []
      } else {
        return []
      }
    }
  },
  created () {
  },
  mounted () {
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
          this.$set(element.animation, type, [info])
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

  .selected-animations {
    padding: 0 12px;
    width: 100%;
    .animation {
      .animation-name {
        width: 90px;
      }
      .el-input-number--mini {
        width: 90px;
      }
      .el-input-number.is-controls-right .el-input__inner {
        padding-left: 5px;
        padding-right: 28px;
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
