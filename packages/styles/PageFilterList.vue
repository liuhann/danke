<template>
  <div id="page-style-list">
    <section class="section is-white">
      <div class="container">
        <el-button size="mini" type="primary" @click="newStyle">新建</el-button>
        <div class="style-list">
          <div v-for="(style, index) in styles" :key="index" class="style-item">
            <div class="style-container" :class="style.name">
              <img src="https://picturepan2.github.io/instagram.css/assets/img/instagram.jpg" />
            </div>
            <div class="btns">
              {{ style.title }}
              <el-button type="text" size="mini" icon="el-icon-delete" @click="removeStyle(style)" />
              <el-button type="text" size="mini" icon="el-icon-edit" @click="editStyle(style)" />
            </div>
          </div>
        </div>
        <el-pagination background :total="total" :page-size="pageSize" :current-page.sync="page" layout="prev, pager, next" @current-change="loadStyles" />
      </div>
    </section>
  </div>
</template>

<script>
import RestDAO from '../utils/restdao.js'
import { Pagination, Button } from 'element-ui'
import StyleRegistry from '../xd-builder/utils/StyleRegistry.js'
import '../site/common.scss'
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
    this.styleRegistry = new StyleRegistry()
    this.loadStyles()
  },
  methods: {
    newStyle () {
      window.open('/filter/edit')
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
          this.styleRegistry.addStyle(style)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 新窗口编辑
    editStyle (style) {
      window.open('/filter/edit?id=' + style._id)
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
    margin-bottom: 3rem;
    width: 20%;
    box-sizing: border-box;
    padding: 1rem;
    .style-container {
      padding: 3rem 1rem;
      justify-content: center;
      display: flex;
      align-items: center;
      img {
        width: 75%;
        box-shadow: 0 0.3rem 2rem rgba(51,51,51,.15);
      }

    }
     .btns {
      padding: 2rem;
      font-size: 1.5rem;
      color: #999;
    }
  }
 
}

</style>
