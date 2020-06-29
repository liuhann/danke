<template>
<el-dialog title="选择FlatIcon图标" :visible.sync="dialogVisible" :modal-append-to-body="true" :append-to-body="true">
  <div class="icon-container">
    <el-tabs v-model="activeName" @tab-click="tabSwitched">
      <el-tab-pane v-for="(tag, index) of FlatTags" :label="tag.zh" :name="tag.en" :key="index">
        <ul class="icon-list">
          <li v-for="(icon, index) in flatIcons" :key="index" @click="chooseIcon(icon)">
            <img :src="icon.url">
            <span class="icon-name">
          {{icon.desc}}
        </span>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</el-dialog>
</template>

<script>
import { Dialog, Tabs, TabPane } from 'element-ui'
import RestDAO from '../utils/restdao.js'
import FlatTags from './tags'
export default {
  name: 'DialogChooseFlatIcon',
  components: {
    [Dialog.name]: Dialog,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane
  },
  data () {
    return {
      activeName: FlatTags[0].en,
      currentPage: 1,
      dialogVisible: false,
      flatIcons: [],
      FlatTags
    }
  },
  created () {
    this.flatdao = new RestDAO(this.ctx, 'flaticon/icon')
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.loadFlatIcons()
    },
    async loadFlatIcons () {
      const result = await this.flatdao.list({
        page: this.currentPage,
        tags: this.activeName,
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
@import "./common.scss";
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
