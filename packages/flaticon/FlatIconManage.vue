<template>
<div id="flat-icon-manage">
  <div class="manage">
    <el-select v-model="tag" size="mini">
      <el-option v-for="o of FlatTags" :key="o.en" :value="o.en" :label="o.zh"/>
    </el-select>
    <ul class="icon-list">
      <li v-for="(icon, index) in flatIcons" :key="index">
        <img :src="icon.url">
        <span class="icon-name">
          {{icon.desc}}
        </span>
        <span class="btns">
          <el-button type="text" size="mini" icon="el-icon-delete" style="color: red;" @click="deleteIcon(icon)"></el-button>
        </span>
      </li>
    </ul>
  </div>
  <div class="search">
    <el-row>
      <el-col :span="12">
        <el-input v-model="query" size="mini" />
      </el-col>
      <el-col :span="6">
        <el-input v-model="color" size="mini" />
      </el-col>
      <el-col :span="6">
        <el-button size="mini" icon="el-icon-search" @click="queryFlatIcon"></el-button>
        <el-button size="mini" @click="nextPage">下一页</el-button>
      </el-col>
    </el-row>

    <ul class="icon-list">
      <li v-for="(icon, index) in queryResult" :key="index">
        <img :src="icon.images.svg">
        <span class="icon-name" style="height: 20px; text-overflow: ellipsis; word-break: break-all;">
          {{icon.description}}
        </span>
        <span class="btns">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="add(icon.images.svg, icon.tags, icon.description)"></el-button>
        </span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import { Table, Input, Button, TableColumn, Select, Option, Row, Col } from 'element-ui'
import ky from 'ky'
import RestDAO from '../common/dao/restdao'
import 'element-ui/packages/theme-chalk/lib/icon.css'
import FlatTags from './tags'

export default {
  name: 'FlatIconManage',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Input.name]: Input,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [Row.name]: Row,
    [Col.name]: Col
  },
  data () {
    return {
      page: 1,
      color: '2',
      tag: '',
      query: '',
      flatIcons: [],
      queryResult: [],
      FlatTags
    }
  },

  watch: {
    'tag': function () {
      this.loadFlatIcons()
    }
  },
  created () {
    this.flatdao = new RestDAO(this.ctx, 'flaticon/icon')
    this.loadFlatIcons()
  },
  methods: {
    async loadFlatIcons () {
      const result = await this.flatdao.list({
        count: 100,
        tags: this.tag
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
    async queryFlatIcon (page) {
      if (!page) {
        page = 1
        this.page = 1
      }
      const result = await this.ctx.get('flaticon/search?q=' + this.query + '&color=' + this.color + '&page=' + this.page).json()
      this.queryResult = result
    },

    async nextPage () {
      this.page++
      this.queryFlatIcon(this.page)
    },
    async add (svgUrl, tags, desc) {
      const text = await ky.get(svgUrl).text()
      const tagArray = tags.split(',')
      if (this.tag) {
        tagArray.push(this.tag)
      }
      await this.flatdao.create({
        svg: text,
        tags: tagArray,
        desc: desc
      })
    },
    async deleteIcon (icon) {
      await this.flatdao.delete(icon)
      this.loadFlatIcons()
    }
  }
}
</script>

<style lang="scss">
#flat-icon-manage {
  @import "./common.scss";
  display: flex;
  .manage {
    flex: 1;
  }
  .icon-name {
  }
  .search {
    flex: 1;
  }
}
</style>
