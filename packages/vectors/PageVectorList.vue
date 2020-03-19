<template>
<div id="page-vector-list">
  <nav-bar />
  <section class="section splash align-centered">
    <div class="container">
      <h1>多彩多样的矢量图片</h1>
      <h2>基于SVG文件格式，可任意配置、下载</h2>
    </div>
  </section>
  <section class="section vector-section">
    <div class="container">
      <el-button size="mini" type="primary" @click="newStyle">新建</el-button>
      <div class="svg-list">
        <div v-for="(svg, index) in svgs" :key="index" class="svg-item">
          <div class="title">{{svg.name}}</div>
          <div class="svg-container" :style="variableValues(svg)">
            <div class="styled-box" v-html="svg.content">
            </div>
          </div>
          <div class="item-btns">
            <el-button circle icon="el-icon-delete" @click="remove(svg)"/>
            <el-button circle icon="el-icon-edit" @click="edit(svg)"/>
          </div>
        </div>
      </div>
      <el-pagination background :total="total" :page-size="pageSize" @current-change="loadSVGs" :current-page.sync="page" layout="prev, pager, next" />
    </div>
  </section>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao'
import NavBar from '../site/components/NavBar.vue'
import { Pagination, Button } from 'element-ui'
export default {
  name: 'PageStyleList',
  components: {
    NavBar,
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
      window.open('/vector/edit')
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
      window.open('/vector/edit?id=' + svg.name)
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
    async remove (style) {
      if (confirm('确认删除样式')) {
        await this.svgdao.delete(style)
        this.loadSVGs()
      }
    }
  }
}
</script>

<style lang="scss">
#page-vector-list {
  color: #fff;
  font-size: 16px;
  background: linear-gradient(180deg, #0C003C 0%, #BFFFAF 120%), linear-gradient(165deg, #480045 25%, #E9EAAF 120%), linear-gradient(145deg, #480045 25%, #E9EAAF 100%), linear-gradient(300deg, rgba(233, 223, 255, 0) 0%, #AF89FF 100%), linear-gradient(90deg, #45EBA5 0%, #45EBA5 30%, #21ABA5 30%, #21ABA5 60%, #1D566E 60%, #1D566E 70%, #163A5F 70%, #163A5F 10%);
  background-blend-mode: overlay, overlay, overlay, multiply, normal;
}
.splash {
  h1 {
    font-size: 40px;
    text-align: center;
  }
  h2 {
    font-size: 22px;
    text-align: center;
  }
  height: 10rem;
  margin: 4rem 0;
}
.vector-section {
  background: #fff;
  padding: 3rem 0;
}
.svg-list {
  display: flex;
  flex-wrap: wrap;
  .svg-item {
    width: calc(25% - 52px);
    position: relative;
    border: #e6e6e6 solid 1px;
    margin: 0 32px 50px 0;
    border-radius: 20px;
    padding: 30px 10px;
    .title {
      position: absolute;
      color: #444;
      top: 16px;
      left: 16px;
    }
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    .item-btns {
      position: absolute;
      width: 100%;
      left: 20px;
      bottom: 20px;
      display: none;
    }
    &:hover {
      .item-btns {
        display: initial;
      }
    }
    .svg-container {
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      .styled-box {
        width: 80%;
        height: 200px;
        z-index: 10;
        position: relative;
        svg {
          width: 100%;
          height: 100%;
        }
    }
    }
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
  }
}

</style>
