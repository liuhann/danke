<template>
  <el-form size="mini" class="animation-form" inline>
    <el-form-item>
      <el-input-number v-model="animation.range[0]" size="mini" controls-position="right" :step="0.1" /> 
    </el-form-item>
    <el-form-item>
      <el-input-number v-model="animation.range[1]" size="mini" controls-position="right" :step="0.1" />
    </el-form-item>
    <el-form-item label="循环">
      <el-checkbox v-model="animation.infinite" />
    </el-form-item>
    <el-form-item label="次数">
      <el-input-number v-model="animation.iteration" :disabled="animation.infinite" size="mini" controls-position="right" />
    </el-form-item>
    <el-form-item label="过渡">
      <el-select v-model="animation.timing">
        <el-option v-for="(value, key) in cubicBerziers" :key="key" :label="key" :value="value" />
      </el-select>
    </el-form-item>
    <el-form-item v-for="variable in animation.variables" :key="variable.name" :label="variable.label || variable.name">
      <el-input v-model="variable.value" style="width: 80px;" />
    </el-form-item>
  </el-form>
</template>

<script>
import toolbarPopMixin from '../toolbar/toolbarPopMixin'
import cubicBerziers from '../../frames/model/cubic-beziers.js'
export default {
  name: 'AnimationForm',
  mixins: [ toolbarPopMixin ],
  props: {
    animation: {
      type: Object
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
  }
}
</script>

<style lang="scss">
.animation-form {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, .2);
  margin-bottom: 10px;
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
</style>
