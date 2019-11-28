<template>
<div id="flat-icon-manage">
  <div class="manage">
    <el-select v-model="tag" size="mini">
      <el-option v-for="o of FlatTags" :key="o.en" :value="o.en">{{o.zh}}</el-option>
    </el-select>
    {{tag}}
    <ul class="icon-list">
      <li v-for="(icon, index) in flatIcons" :key="index">
        <img :src="icon.url">
        <span class="icon-name">
          {{icon.desc}}
        </span>
        <span class="btns">
          <el-button type="text" size="mini" icon="el-icon-trash" @click="deleteIcon(icon)"></el-button>
        </span>
      </li>
    </ul>
  </div>
  <div class="search">
    <el-input v-model="query" size="mini">
      <el-button slot="append" icon="el-icon-search" @click="queryFlatIcon"></el-button>
    </el-input>
    <ul class="icon-list">
      <li v-for="(icon, index) in queryResult" :key="index">
        <img :src="icon.images.svg">
        <span class="icon-name">
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
import { Table, Input, Button, TableColumn, Select, Option } from 'element-ui'
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
    [Option.name]: Option
  },
  data () {
    return {
      tag: '',
      query: '',
      flatIcons: [],
      queryResult: [],
      FlatTags
    }
  },
  created () {
    this.flatdao = new RestDAO(this.ctx, 'flaticon/icon')
    this.loadFlatIcons()
  },
  methods: {
    async loadFlatIcons () {
      const result = await this.flatdao.list({
        count: 100
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
    async queryFlatIcon () {
      const result = await this.ctx.get('flaticon/search?q=' + this.query).json()
      this.queryResult = result
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
  .search {
    flex: 1;
  }
}
</style>
