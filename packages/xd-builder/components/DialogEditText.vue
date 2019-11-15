<template>
<el-dialog
  title="编辑文字"
  :fullscreen="fullscreen"
 :visible.sync="dialogVisible">
 <textarea v-model="editedText" class="edit-text"></textarea>
 <span slot="footer" class="dialog-footer">
   <el-button @click="confirm" size="mini">确 定</el-button>
 </span>
</el-dialog>
</template>

<script>
import { Dialog, Button } from 'element-ui'
export default {
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button
  },
  data () {
    return {
      editedText: '',
      dialogVisible: false,
      fullscreen: true
    }
  },
  methods: {
    open (text) {
      this.editedText = text.replace(/<br>/g, '\n')
      this.dialogVisible = true
    },

    confirm () {
      this.$emit('input', this.editedText.replace(/\n/g, '<br>'))
      this.dialogVisible = false
    }
  }
}
</script>

<style type="text/css">
.edit-text {
  width: 100%;
  height: 100%;
}
</style>
