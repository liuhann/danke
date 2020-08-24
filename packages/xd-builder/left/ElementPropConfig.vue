<template>
  <el-form label-width="80px" size="mini" class="more-action-form">
    <el-form-item label="名称">
      <el-input v-model="element.name" />
    </el-form-item>
    <el-form-item label="宽高">
      <el-input-number v-model="element.width" :precision="2" controls-position="right" size="mini" />-<el-input-number v-model="element.height" :precision="2" controls-position="right" size="mini" />
    </el-form-item>
    <el-form-item label="坐标">
      <el-input-number v-model="element.x" :precision="2" controls-position="right" size="mini" />-<el-input-number v-model="element.y" :precision="2" controls-position="right" size="mini" />
    </el-form-item>
    <el-form-item label="旋转">
      <el-input-number v-model="element.rotate" controls-position="right" size="mini" />
    </el-form-item>
    <el-form-item label="图片适应">
      <el-select v-model="element.fit">
        <el-option label="适应" value="cover" />
        <el-option label="包含" value="contain" />
        <el-option label="拉伸" value="fill" />
      </el-select>
    </el-form-item>
    <el-form-item label="视角高度">
      <el-input-number v-model="element.style.perspective" controls-position="right" size="mini" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ElementPropConfig',
  props: {
    scene: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: { },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.more-action-form {
  padding: 16px;
  .el-input-number--mini {
    width: 110px;
    margin: 0 10px;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 5px;
    padding-right: 28px;
  }
}
</style>
