<template>
  <div id="addon-filter-list" class="left-aside-content">
    <div class="search-box">
      <el-input v-model="searchValue" placeholder="搜索滤镜" class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>

    <div class="list">
      <div class="filter-item clear-filter" @click="chooseFilter(null)">
        清除滤镜
      </div>
      <div v-for="(style, index) in styles" :key="index" class="filter-item" @click="chooseFilter(style)">
        <div class="style-container">
          <div class="element" :class="style.name">
            <img :src="'https://media-public.canva.cn/MADLFoi3fk0/1/screen.jpg'" />
          </div>
        </div>
        <div class="desc">
          {{ style.title }}
        </div>
      </div>
    </div>
    <div style="display:none">
      <svg v-for="(svgfilter, index) of svgFilters" :key="index" v-html="svgfilter" />
    </div>
    <div class="pager">
      <el-pagination
        background layout="prev, pager, next"
        :page-size="pageSize"
        :total="total" :current-page.sync="page" @current-change="loadStyles"
      />
    </div>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import StyleRegistry from '../utils/StyleRegistry.js'
export default {
  props: {
    preview: {
      type: String
    }
  },
  data () {
    return {
      searchValue: '',
      styles: [],
      page: 0,
      pageSize: 30,
      total: 0,
      svgFilters: []
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
      this.svgFilters = this.styleRegistry.svgfilters;
    },

    chooseFilter (style) {
      this.$emit('insert', style)
    }
  }
}
</script>

<style lang="scss">
#addon-filter-list {
  padding: 8px;
  .list {
    display: flex;
    flex-wrap: wrap;
    .filter-item {
      &.clear-filter {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #eee;
        height: 80px;
      }
      margin: 5px;
      width: 100px;
      height: 100px;
      .desc {
        color: #ddd;
        text-align: center;
        line-height: 28px;
      }
      .style-container {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        .element {
          border-radius: 3px;
          width: 100px;
          height: 80px;
          overflow: hidden;
          &::before {
            display: block;
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: 11;
          }
          img {
            width: 100px;
            object-fit: cover;
            height: 80px;
          }
        }
      }
    }
  }
}
</style>