<template>
<el-popover
  v-if="popover"
  :placement="placement"
  popper-class="toolbar-pop"
  :width="width"
  :title="title"
  @show="$emit('show')"
  trigger="click">
  <a class="action" slot="reference">
    <i v-if="icon" :class="icon" />
    <slot v-else name="reference"/>
  </a>
  <div class="container">
    <slot></slot>
  </div>
</el-popover>
<div v-else>
  <a class="action" slot="reference" @click="openDialog">
    <i v-if="icon" :class="icon" />
    <slot v-else name="reference"/>
  </a>
  <el-dialog
    :fullscreen="true"
    :title="title"
    :visible.sync="dialogVisible">
    <slot></slot>
  </el-dialog>
</div>
</template>

<script>
import { Popover, Dialog } from 'element-ui'
export default {
  name: 'PopWrapper',
  components: {
    [Popover.name]: Popover,
    [Dialog.name]: Dialog
  },
  props: {
    popover: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 480
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    icon: {
      type: String,
      default: 'el-icon-timer'
    },
    title: {
      type: String
    }
  },

  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
      this.$emit('show')
    }
  }
}
</script>

<style lang="scss">
.toolbar-pop {
  padding-right: 4px;
  .container {
    max-height: calc(100vh - 77px);
    overflow-y: auto;
  }
}
</style>
