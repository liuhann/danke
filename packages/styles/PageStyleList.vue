<template>
<div class="section" style="">
  <div class="container" style="padding: 20px;box-shadow: 0 1px 5px 0 rgba(0,0,0,.1);">
    <el-button @click="newStyle">新建</el-button>
    <div class="style-list">
      <div v-for="(style, index) in styles" :key="index" class="style-item">
          <div class="style-container">
            <div class="styled-box" :class="style.name">
              {{style.desc}}
            </div>
          </div>
          <div class="btns">
            <el-button type="text" size="mini" icon="el-icon-delete" @click="removeStyle(style._id)"/>
            <el-button type="text" size="mini" icon="el-icon-edit" @click="editStyle(style._id)"/>
          </div>
        </div>
    </div>
    <el-pagination background :total="total" :page-size="pageSize" @current-change="loadStyles" :current-page.sync="page" layout="prev, pager, next" />
  </div>
</div>

</template>

<script>
import RestDAO from '../common/dao/restdao'
import { Pagination, Button } from 'element-ui'
import { createSheet, addStyle } from '../frames/keyframe.js'
export default {
  name: 'PageStyleList',
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  data () {
    return {
      styles: [],
      page: 0,
      pageSize: 20,
      total: 0
    }
  },
  created () {
    this.styledao = new RestDAO(this.ctx, 'danke/style')
  },
  mounted () {
    this.sheet = createSheet()
    this.loadStyles()
  },
  methods: {
    newStyle () {
      window.open('/style/edit')
    },
    async loadStyles () {
      const result = await this.styledao.list({
        page: this.page,
        count: this.pageSize
      })
      this.total = result.total
      this.styles = result.list
      try {
        for (let style of result.list) {
          const splits = style.cssContent.split('\n\n')
          for (let css of splits) {
            addStyle(this.sheet, css)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    editStyle (id) {
      window.open('/style/edit?id=' + id)
    }
  }
}
</script>

<style lang="scss">
.style-list {
  display: flex;
  .style-item {
    width: 20%;
  }
  .style-container {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    .styled-box {
      width: 120px;
      height: 120px;
    }
  }
}
</style>
