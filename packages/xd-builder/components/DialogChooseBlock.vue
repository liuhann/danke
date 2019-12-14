<template>
  <el-dialog title="选择页面模板" :visible.sync="dialogVisible" custom-class="dialog-choose-block"
             :modal-append-to-body="true" :append-to-body="true" top="5vh">
    <div class="block-container">
      <work-cover
        v-for="(block, index) of blocks" :key="index"
        :show-play="false" :work="block"
        :device-set="deviceSet"
        @click="chooseBlock(block)"
      />
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, Tabs, TabPane } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import saveShare from '../mixins/saveShare'
import WorkCover from './WorkCover'
export default {
  name: 'DialogChooseBlock',
  mixins: [ saveShare ],
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
        height: 280
      },
      blocks: [],
      currentPage: 1,
      dialogVisible: false
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.loadBlocks()
    },
    chooseBlock (block) {
      this.$emit('input', block.cover)
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
  .work-cover {
    float: left;
    margin: 0 5px;
    border-radius: 5px;
    box-shadow: 0 0 3px rgba(0,0,0, .5);
  }
}
</style>
