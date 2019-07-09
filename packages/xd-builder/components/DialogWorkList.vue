<template>
<el-dialog 
  title="打开已有作品"
  :visible.sync="dialogVisible">
</el-dialog>
</template>
<script>
import { Dialog } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
export default {
  components: {
    Dialog
  },
  data () {
    return {
      works: [],
      dialogVisible: false
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  methods: {
    async open () {
      this.dialogVisible = true
      const result = await this.workdao.list()
      debugger
    }
  }
}
</script>

<style>

</style>
