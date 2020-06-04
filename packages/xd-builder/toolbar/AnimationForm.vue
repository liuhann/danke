<template>
  <div class="animation-form-list">
    <el-form :title="animation.title" size="mini" v-for="(animation, index) in element.animation.enter" :key="index" class="animation-form" inline>
      <el-form-item :label="animation.title" />
      <el-form-item label="延迟"> <el-input-number size="mini" v-model="animation.range[0]" controls-position="right" :step="0.1"/> 秒</el-form-item>
      <el-form-item label="持续"> <el-input-number size="mini" v-model="animation.range[1]" controls-position="right" :step="0.1"/> 秒</el-form-item>
      <el-form-item label="循环"> <el-checkbox v-model="animation.infinite" /></el-form-item>
      <el-form-item label="次数"> <el-input-number :disabled="animation.infinite" size="mini" v-model="animation.iteration" controls-position="right"/> 次</el-form-item>
      <el-form-item label="过渡曲线"> <el-select v-model="animation.timing">
          <el-option v-for="(value, key) in cubicBerziers" :key="key" :label="key" :value="value"></el-option>
      </el-select></el-form-item>
      <el-form-item >  <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeAnimation(index)"></el-button> </el-form-item>
    </el-form>
  </div>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import cubicBerziers from '../../frames/model/cubic-beziers.js'
export default {
  name: 'AnimationForm',
  mixins: [ toolbarPopMixin ],
  props: {
    element: {
      type: Object
    },
    type: {
      type: String,
      default: 'enter'
    }
  },
  data () {
    return {
      cubicBerziers
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
