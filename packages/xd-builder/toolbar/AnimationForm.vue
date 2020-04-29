<template>
  <div class="animation-form-list">
    <div v-for="(animation, index) in element.animation.enter" :key="index" class="animation-form">
      <div class="title">
        {{animation.title}}
        <i>{{index + 1}}</i>
      </div>
      <div class="config">
        <div class="line">
          <div class="delay">
            延迟 <el-input-number size="mini" v-model="animation.range[0]" controls-position="right" :step="0.1"/> 秒
          </div>
          <div class="duration">
            持续 <el-input-number size="mini" v-model="animation.range[1]" controls-position="right" :step="0.1"/> 秒
          </div>
        </div>
        <div class="line">
          <div class="duration">
            次数 <el-input-number :disabled="animation.infinite" size="mini" v-model="animation.iteration" controls-position="right"/> 次
          </div>
          <div class="infinite">
            循环 <el-checkbox v-model="animation.infinite"></el-checkbox>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeAnimation(index)"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { TabPane, Tabs, Slider, Button, Popover, InputNumber, Select, Option, Checkbox } from 'element-ui'
export default {
  name: 'AnimationForm',
  components: {
    [InputNumber.name]: InputNumber,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [Checkbox.name]: Checkbox,
  },
  props: {
    element: {
      type: Object
    },
    type: {
      type: String,
      default: 'enter'
    }
  },
  computed: {
    animations () {
      return this.element.animation[this.type] || []
    }
  },
  methods: {
    removeAnimation (index) {
      this.element.animation[this.type].splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.animation-form-list {
  min-height: 160px;
  .animation-form {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    .title {
      position: relative;
      font-size: 1.25rem;
      width: 90px;
      padding: 10px;
      box-sizing: border-box;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        position: absolute;
        left: 2px;
        top: -10px;
        background-color: #00bf72;
        width: 20px;
        height: 20px;
        font-size: 12px;
        color: #fff;
        font-style: normal;
      }
    }

    .config {
      flex: 1;
      line-height: 30px;
      .line {
        display: flex;
        >div {
          margin-right: 10px;
        }
      }
    }
    .right {
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-left: 5px;
      padding-right: 32px;
    }
    .el-input-number--mini {
      width: 64px;
    }
  }
}
</style>