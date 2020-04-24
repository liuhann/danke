<template>
<el-popover
  placement="bottom-start"
  visible-arrow
  popper-class="toolbar-pop"
  width="400"
  trigger="click">
  <a class="action" slot="reference" title="特效">
    <IconEffect/>
  </a>
  <div id="animation-config-tab">
    <tabs v-model="type" @tab-click="typeChange">
      <tab-pane v-for="type in types" :key="type.value" :label="type.label" :name="type.value" />
    </tabs>
    <div class="type-groups">
      <div v-for="g in groups" :key="g" class="group" :class="g=== group? 'current': ''" @click="groupChange(g)">{{g}}</div>
    </div>

    <div class="animations">
      <div v-for="a in animations" :key="a.name" class="animation" :class="a === animation? 'current': ''" @click="animationChange(a)">{{a.direction}}</div>
    </div>
      <!--<tab-pane label="进入" name="enter" class="animation-list">
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
      </tab-pane>-->
  </div>
</el-popover>


</template>

<script>
import AnimationList from './AnimationList.vue'
import IconEffect from './res/effects.svg'
import types from '../../frames/types'
import { TabPane, Tabs, Slider, Button, Popover, InputNumber } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
export default {
  name: 'PopSetAnimation',
  props: {
    element: {
      type: Object
    }
  },
  components: {
    [InputNumber.name]: InputNumber,
    [Popover.name]: Popover,
    [Button.name]: Button,
    IconEffect,
    TabPane,
    Tabs
  },
  data () {
    return {
      types,
      type: 'basic',
      group: '',
      groups: [],
      animation: '',
      animations: []
    }
  },
  computed: {
    elementType () {
      if (this.element.text != null) {
        return 'text'
      } else {
        return 'enter'
      }
    },
    enterAnimations () {
      return this.element.animation.enters || []
    },
    existAnimations () {
      return this.element.animation.exists || []
    }
  },
  created () {
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },
  mounted () {
  },
  methods: {
    async typeChange () {
      await this.loadTypeGroup()
      this.group = this.groups[0]
      await this.loadGroupAnimations()
    },
    async loadTypeGroup () {
      const result = await this.framedao.distinct('group', {
        type: this.type
      })
      this.groups = result
    },

    async groupChange(group) {
      this.group = group
      this.loadGroupAnimations()
    },

    async loadGroupAnimations () {
      const result = await this.framedao.list({
        type: this.type,
        group: this.group
      })
      this.animations = result.list
    },

    animationChange (animation) {

    },
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
      this.$set(this.element.animation, type, [info])
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

  .type-groups {
    display: flex;
    flex-wrap: wrap;
    .group {
      width: 60px;
      height: 60px;
      cursor: pointer;
      border-radius: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 4px 3px;
      background-color: #efefef;
      &.current {
        background: #00c4cc;
        color: #fff;
      }
    }
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }
  .animations {
    display: flex;
    flex-wrap: wrap;
    .animation {
      padding: 3px 8px;

    }
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
