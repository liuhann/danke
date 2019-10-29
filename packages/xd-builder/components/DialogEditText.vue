<template>
<el-dialog
  title="编辑文字"
  :fullscreen="fullscreen"
 :visible.sync="dialogVisible">
 <textarea v-model="editedText" class="edit-text">
   
 </textarea>
 <span slot="footer" class="dialog-footer">
   <a class="button is-primary is-medium" @click="confirm">
      确 定
   </a>
 </span>
</el-dialog>
</template>

<script>
import { Dialog, Loading } from 'element-ui'
export default {
  components: {
    [Dialog.name]: Dialog
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