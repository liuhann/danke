<template>
  <div id="page-vector-list">
    <div class="container">
      <div class="tool-bar">
        <el-button size="mini" type="primary" @click="newStyle">新建</el-button>
      </div>
      <div class="svg-list">
        <div v-for="(html, index) in list" :key="index" class="html-item">
          <div class="svg-container" :style="variableValues(html)">
            <div class="styled-box" v-html="html.html">
            </div>
          </div>
          <div class="item-btns">
            <el-button circle icon="el-icon-delete" @click="remove(html)" />
            <el-button circle icon="el-icon-edit" @click="edit(html)" />
          </div>
        </div>
      </div>
      <el-pagination background :total="total" :page-size="pageSize" :current-page.sync="page" layout="prev, pager, next" @current-change="load" />
    </div>
  </div>
</template>

<script>
import RestDAO from '../utils/restdao.js'
import NavBar from '../site/components/NavBar.vue'
import { Pagination, Button, Tabs, TabPane } from 'element-ui'
export default {
  name: 'PageHtmlList',
  components: {
    [Pagination.name]: Pagination,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Button.name]: Button
  },
  data () {
    return {
      list: [],
      page: 0,
      pageSize: 20,
      total: 0
    }
  },
  created () {
    this.dao = new RestDAO(this.ctx, 'danke/h5')
  },
  mounted () {
    this.load()
  },
  methods: {
    newStyle () {
      window.open('/h5/edit')
    },
    async load () {
      const result = await this.dao.list({
        page: this.page,
        count: this.pageSize
      })
      this.total = result.total
      this.list = result.list
    },
    // 新窗口编辑
    edit (html) {
      window.open('/h5/edit?id=' + html._id)
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
        await this.dao.delete(style)
        this.load()
      }
    }
  }
}
</script>

<style lang="scss">
#page-vector-list {
  color: #fff;
  font-size: 16px;
  .container {
    margin: 20px;
  }
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
  .html-item {
    width: calc(12.5% - 16px);
    box-sizing: border-box;
    position: relative;
    border: #e6e6e6 solid 1px;
    margin: 0 16px 16px 0;
    border-radius: 5px;
    padding: 10px;
    .title {
      position: absolute;
      color: #444;
      top: 16px;
      left: 16px;
    }
    .album {
      position: absolute;
      color: #444;
      top: 16px;
      right: 16px;
    }
    &:nth-of-type(8n) {
      margin-right: 0;
    }
    .item-btns {
      position: absolute;
      width: 100%;
      left: 20px;
      bottom: 20px;
      display: none;
      z-index: 999;
    }
    .svg-container {
      display: flex;
      align-items: center;
      justify-content: center;
      .styled-box {
        height: 100%;
        z-index: 10;
        position: relative;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    &:hover {
      .item-btns {
        display: initial;
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
