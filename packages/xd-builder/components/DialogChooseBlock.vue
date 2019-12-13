<template>
  <el-dialog title="选择页面模板" :visible.sync="dialogVisible" custom-class="dialog-choose-block"
             :modal-append-to-body="true" :append-to-body="true" top="5vh">
    <div class="block-container">
      <work-cover v-for="(block, index) of blocks" :key="index" :work="block" :device-set="deviceSet"/>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, Tabs, TabPane } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import WorkCover from './WorkCover'
export default {
  name: 'DialogChooseBlock',
  components: {
    WorkCover,
    [Dialog.name]: Dialog,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane
  },
  data () {
    return {
      deviceSet: {
        width: 160,
        height: 320
      },
      blocks: [],
      currentPage: 1,
      dialogVisible: false
    }
  },
  created () {
    this.blockdao = new RestDAO(this.ctx, 'danke/block')
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.loadBlocks()
    },
    async loadBlocks () {
      const result = await this.blockdao.list({
        page: this.currentPage,
        count: 20
      })
      this.blocks = []
      for (let block of result.list) {
        const work = {
          cover: block
        }
        this.blocks.push(work)
      }
    }
  }
}
</script>

<style lang="scss">
.dialog-choose-block {
  width: 1120px;
}
.block-container {
  height: 70vh;
  overflow: auto;
}
</style>
