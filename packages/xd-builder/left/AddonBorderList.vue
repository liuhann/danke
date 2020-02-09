<template>
<div id="addon-border-list">
  <div class="style-list">
    <div class="style-item">
      空白
    </div>
    <div v-for="(style, index) in styles" :key="index" class="style-item" @click="useStyle(style)">
      <div class="style-container">
        <div class="styled-box" :class="style.name">
          <div class="inner">{{style.title}}</div>
        </div>
      </div>
    </div>
  </div>
  <el-pagination background :total="total" :page-size="pageSize" @current-change="loadStyles" :current-page.sync="page" layout="prev, pager, next" />
</div>

</template>

<script>
import { Pagination, Button } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import { createSheet, addStyle } from '../../frames/keyframe.js'
export default {
  name: 'AddonBorderList',
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  prop: {
    styleName: {
      type: String
    }
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

    useStyle (style) {
      this.$emit('border', style)
    }
  }
}
</script>
<style lang="scss">
#addon-border-list {
  padding: 20px;
  .style-list {
    display: flex;
    .style-item {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      margin: 5px 10px;
      cursor: pointer;
      &:hover {
        box-shadow: 0 0 0 2px #00c4cc, inset 0 0 0 2px #fff;
      }
    }
    .style-container {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      .styled-box {
        width: 100px;
        height: 60px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        z-index: 10;
        > div.inner {
          position: absolute;
          z-index: 10;
          width: 100%;
          height: 100%;
          background-color: black;
        }
      }
    }
}
}
</style>
