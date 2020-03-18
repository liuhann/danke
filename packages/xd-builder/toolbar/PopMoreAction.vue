<template>
<el-popover
  placement="bottom-end"
  width="360"
  trigger="click">
  <el-tooltip class="item" effect="dark" content="视觉位置及调整" placement="bottom" slot="reference">
    <a class="action" ><i class="el-icon-turn-off" /></a>
  </el-tooltip>
  <el-form label-width="80px">
    <el-form-item label="大小调整">
      <el-switch
        v-model="element.props.resizable"
        @change="reInitElementDragResize">
      </el-switch>
    </el-form-item>
    <el-form-item label="移动">
      <el-switch
        v-model="element.props.movable"
        @change="reInitElementDragResize">
      </el-switch>
    </el-form-item>w
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

<style scoped>
.more-action-form {
  padding: 16px;
}
</style>
