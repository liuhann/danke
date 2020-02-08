<template>
<el-popover
  class="pop-border-shadow"
  placement="bottom-start"
    title="设置边框"
    width="200"
    trigger="click">
    <el-button slot="reference" icon="el-icon-files" type="text"></el-button>

  </el-popover>
</template>

<script>
import { Popover, Button } from 'element-ui'
export default {
  name: 'PopBorderShadow',
  components: {
    [Popover.name]: Popover,
    [Button.name]: Button
  },
  props: {

  }
}
</script>

<style>

</style>
