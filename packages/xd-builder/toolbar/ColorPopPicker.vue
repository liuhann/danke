<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  width="360"
  @show="resetWorkColors"
  trigger="click">
  <i class="icon choose-color" slot="reference" :style="{
    background: color
  }"/>
  <color-list :color="color" :mode="mode" @input="input" :palette="palette"></color-list>
</el-popover>
</template>

<script>
import { Popover } from 'element-ui'
import ColorList from './color/ColorList'
export default {
  name: 'ColorPopPicker',
  props: {
    color: {
      type: String
    },
    mode: {
      type: String,
      default: 'background'
    }
  },
  components: {
    ColorList,
    [Popover.name]: Popover
  },
  data () {
    return {
      palette: []
    }
  },
  computed : {
  },
  methods: {
    input (val) {
      this.$emit('input', val)
    },
    resetWorkColors() {
      this.palette = this.ctx.palette
    }
  }
}
</script>

<style scoped lang="scss">
.choose-color {
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  width: 26px;
  height: 26px;
  margin: 0 5px;
  &:hover, &.selected {
      cursor: pointer;
      transition: box-shadow .2s linear;
      border: 1px solid transparent;
      box-shadow: 0 0 0 1px #00c4cc, inset 0 0 0 2px #fff;
    }
}
</style>
