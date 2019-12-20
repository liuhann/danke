<template>
  <el-dialog title="选择页面模板" :visible.sync="dialogVisible" custom-class="dialog-choose-block"
             :modal-append-to-body="true" :append-to-body="true" top="5vh">
    <div class="block-container">
      <div class="work-cover-container"  v-for="(block, index) of blocks" :key="index">
        <work-cover
          :show-play="false" :work="block"
          :device-set="deviceSet"
          @click="chooseBlock(block)"
        />
        <el-button size="mini" type="success" @click="chooseBlock(block)">选择</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, Tabs, TabPane, Button } from 'element-ui'
import saveShare from '../mixins/saveShare'
import WorkCover from './WorkCover'
export default {
  name: 'DialogChooseBlock',
  mixins: [ saveShare ],
  components: {
    WorkCover,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
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
      dialogVisible: false
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.loadBlocks()
    },
    chooseBlock (block) {
      this.dialogVisible = false
      debugger
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
  .work-cover-container {
    float: left;
    margin: 10px 8px;
    border: 1px solid #efefef;
    .el-button {
      margin: 5px;
    }
    &:hover {
      cursor: pointer;
      border-color: #00bf72;
    }
  }
}
</style>
