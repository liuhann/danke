<template>
<el-popover
  placement="bottom"
  width="200"
  trigger="click">
  <a class="action" slot="reference" title="变换"></a>
</el-popover>
</template>

<script>
import { Popover } from 'element-ui'
export default {
  name: 'PopTransform',
  components: {
    [Popover.name]: Popover
  }
}
</script>

<style scoped>

</style>
