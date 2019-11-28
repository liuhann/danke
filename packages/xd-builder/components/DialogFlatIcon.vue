<template>
<el-dialog
  title="编辑文字"
  :fullscreen="fullscreen"
  :visible.sync="dialogVisible">
  <span slot="footer" class="dialog-footer">
 <el-button @click="confirm" size="mini">确 定</el-button>
</span>
</el-dialog>
</template>

<script>
import { Dialog, Button } from 'element-ui'
export default {
  name: 'PopoverFlatIcon',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button
  },
  props: {
    fullscreen: {
      type: Boolean
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
