<template>
  <div id="left-frames-config" class="left-aside-content">
    <el-tabs v-model="group" tab-position="left" style="height: calc(100vh - 90px)" @tab-click="groupChange">
      <el-tab-pane v-for="g in groups" :key="g" :label="g" :name="g" />
    </el-tabs>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import { assignVariables } from '../mixins/renderUtils'
import { Pagination, Input, Button, Loading, Checkbox, Tabs, TabPane } from 'element-ui'

export default {
  name: 'FrameListConfig',
  components: {
    [Input.name]: Input,
    [Pagination.name]: Pagination,
    [Checkbox.name]: Checkbox,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Button.name]: Button
  },
  data () {
    return {
      group: '',
      animation: {},
      groups: [],
      frames: []
    }
  },
  created () {
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },
  mounted () {
    this.loadGroups ()
    this.currentAlbum = '基础'
  },
  methods: {
    async loadGroups () {
       this.groups = await this.framedao.distinct('group')
       this.group = this.groups[0]
       this.groupChange()
    },
   
   async groupChange () {
      this.frames = (await this.framedao.list({
        group: this.group
      })).list
      if (this.frames.length) {
        this.handleCurrentChange(this.frames[0])
      }
    },
    handleCurrentChange (val) {
      if (val) {
        this.ctx.styleRegistry.addFrame(val)
        this.animation = val
        this.animation.delay = 0
      }
    }
  }
}
</script>

<style >

</style>