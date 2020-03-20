<template>
<el-popover
  placement="bottom-end"
  width="360"
  title="节点设置"
  trigger="click">
  <el-tooltip class="item" effect="dark" content="视觉位置及调整" placement="bottom" slot="reference">
    <a class="action" ><i class="el-icon-edit-outline" /></a>
  </el-tooltip>
  <el-form label-width="80px" size="mini" class="more-action-form">
    <el-form-item label="大小调整">
      <el-checkbox v-model="element.props.resizable" @change="reInitElementDragResize" />
      <el-input-number v-model="element.width" controls-position="right" size="mini"/>
      <el-input-number v-model="element.height" controls-position="right" size="mini" />
    </el-form-item>
    <el-form-item label="移动">
      <el-checkbox v-model="element.props.movable" @change="reInitElementDragResize" />
      <el-input-number v-model="element.x" controls-position="right" size="mini"/>
      <el-input-number v-model="element.y" controls-position="right" size="mini" />
    </el-form-item>
  </el-form>
</el-popover>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import interactMixins from '../mixins/interactMixins'
export default {
  name: 'PopMoreAction',
  mixins: [ toolbarPopMixin, interactMixins ],
  data () {
    return {
    }
  },
  computed: { },
  methods: {
    reInitElementDragResize (val) {
      this.$emit('reset', this.element)
    }
  }
}
</script>

<style lang="scss" scoped>
.more-action-form {
  padding: 16px;
  .el-input-number--mini {
    width: 90px;
    margin: 0 10px;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 5px;
    padding-right: 28px;
  }
}
</style>
