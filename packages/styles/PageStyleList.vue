<template>
<div id="page-style-list" class="site-page">
  <nav-bar />
  <section class="section splash">
    <div class="container">
      <h1>精彩样式、一键引入</h1>
      <h2>想要美化您的页面元素？ 边框、渐变背景、动画</h2>
    </div>
  </section>
  <section class="section is-white">
    <div class="container">
      <el-button size="mini" type="primary" @click="newStyle">新建</el-button>
      <div class="style-list">
        <div v-for="(style, index) in styles" :key="index" class="style-item">
          <div class="style-container">
            <div class="styled-box" :class="style.name">
              <div class="inner">{{style.desc}}</div>
            </div>
          </div>
          <div class="btns">
            <el-button type="text" size="mini" icon="el-icon-delete" @click="removeStyle(style)"/>
            <el-button type="text" size="mini" icon="el-icon-edit" @click="editStyle(style)"/>
            <span class="category">{{style.category}}</span>
          </div>
        </div>
      </div>
      <el-pagination background :total="total" :page-size="pageSize" @current-change="loadStyles" :current-page.sync="page" layout="prev, pager, next" />
    </div>
  </section>
</div>
</template>

<script>
import RestDAO from '../utils/restdao.js'
import { Pagination, Button } from 'element-ui'
import { createSheet, addStyle } from '../frames/keyframe.js'
import NavBar from '../site/components/NavBar'
import '../site/common.scss'
export default {
  name: 'PageStyleList',
  components: {
    NavBar,
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
    // 新窗口编辑
    editStyle (style) {
      window.open('/style/edit?id=' + style._id)
    },

    // 目前暂无提示 直接删除
    async removeStyle (style) {
      if (confirm('确认删除样式')) {
        await this.styledao.delete(style)
        this.loadStyles()
      }
    }
  }
}
</script>

<style lang="scss">
.style-list {
  display: flex;
  flex-wrap: wrap;
  .style-item {
    width: 20%;
  }
  .btns {
    padding: 0 20px;
    .category {
      font-size: 12px;
      border: 1px solid #409EFF;
      padding: 2px;
      border-radius: 4px;
      line-height: 18px;
      color:#409EFF;
      background: rgba(64, 160, 255, 0.075);
      float: right;
    }
  }
  .style-container {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    .styled-box {
      width: 80%;
      height: 120px;
      z-index: 10;
      position: relative;
      > div.inner {
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 100%;
      }
    }
  }
}

</style>
