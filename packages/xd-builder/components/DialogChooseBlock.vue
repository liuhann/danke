<template>
  <el-dialog title="选择页面模板" :visible.sync="dialogVisible" :modal-append-to-body="true" :append-to-body="true">
    <div class="block-container">
      <work-cover v-for="(block, index) of blocks" :key="index" :work="block"/>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, Tabs, TabPane } from 'element-ui'
import RestDAO from '../common/dao/restdao'
import FlatTags from './tags'
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
        count: 1000
      })
      for (let icon of result.list) {
        /// create Blob of inlined SVG
        let svg = new Blob([icon.svg], { type: 'image/svg+xml;charset=utf-8' })
        /// create URL (handle prefixed version)
        let domURL = self.URL || self.webkitURL || self
        let url = domURL.createObjectURL(svg)
        icon.url = url
      }
      this.flatIcons = result.list
    },
    tabSwitched () {
      this.loadFlatIcons()
    },
    chooseIcon (icon) {
      this.dialogVisible = false
      this.$emit('input', icon)
    }
  }
}
</script>

<style lang="scss">
.icon-container {
  height: 60vh;
  overflow: auto;
}
.icon-list li {
  height: 90px;
  &:hover {
    background: #fefefe;
    cursor: pointer;
  }
}
</style>
