<template>
<section class="section" style="background: #dfdfdf;">
  <div class="container" style="background: #fff;padding: 20px;box-shadow: 0 1px 5px 0 rgba(0,0,0,.1);">
    <el-button size="mini" type="primary" @click="newStyle">新建</el-button>
    <div class="svg-list">
      <div v-for="(svg, index) in svgs" :key="index" class="svg-item">
        <div class="svg-container" :style="variableValues(svg)">
          <div class="styled-box" v-html="svg.content">
          </div>
        </div>
        <div class="btns">
          <el-button circle size="mini" icon="el-icon-delete" @click="remove(svg)"/>
          <el-button circle size="mini" icon="el-icon-edit" @click="edit(svg)"/>
          <span class="category">{{svg.category}}</span>
        </div>
      </div>
    </div>
    <el-pagination background :total="total" :page-size="pageSize" @current-change="loadSVGs" :current-page.sync="page" layout="prev, pager, next" />
  </div>
</section>

</template>

<script>
import RestDAO from '../common/dao/restdao'
import { Pagination, Button } from 'element-ui'
export default {
  name: 'PageStyleList',
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  data () {
    return {
      svgs: [],
      page: 0,
      pageSize: 20,
      total: 0
    }
  },
  created () {
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
  },
  mounted () {
    this.loadSVGs()
  },
  methods: {
    newStyle () {
      window.open('/svg/edit')
    },
    async loadSVGs () {
      const result = await this.svgdao.list({
        page: this.page,
        count: this.pageSize
      })
      this.total = result.total
      this.svgs = result.list
    },
    // 新窗口编辑
    edit (svg) {
      window.open('/svg/edit?id=' + svg._id)
    },

    variableValues (svg) {
      const styles = {}
      for (let variable of svg.variables) {
        Object.assign(styles, {
          [`--${variable.name}`]: variable.value
        })
      }
      return styles
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
.svg-list {
  display: flex;
  flex-wrap: wrap;
  .svg-item {
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

  .svg-container {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    .styled-box {
      width: 80%;
      height: 120px;
      z-index: 10;
      position: relative;
      svg {
        max-height: 120px;
      }
    }
  }
}

</style>
