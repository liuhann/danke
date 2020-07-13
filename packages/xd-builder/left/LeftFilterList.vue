<template>
  <div id="addon-filter-list">
    <div class="search-box">
      <el-input v-model="searchValue" placeholder="搜索滤镜" class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>

    <div class="list">
      <div v-for="(style, index) in styles" :key="index" class="filter-item">
        <div class="style-container">
          <div class="element" :class="style.name">
            <img src="https://media-public.canva.cn/MADLFoi3fk0/1/screen.jpg" />
          </div>
        </div>
        <div class="desc">
          {{style.name}}
        </div>
      </div>
    </div>

    <div class="pager">
    </div>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import StyleRegistry from '../utils/StyleRegistry.js'
export default {
  data () {
    return {
      searchValue: '',
      styles: [],
      page: 0,
      pageSize: 20,
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
  }
}
</script>

<style lang="scss">
#addon-filter-list {
  .list {
    display: flex;
    flex-wrap: wrap;
    .filter-item {
      margin: 5px;
      width: 100px;
      height: 120px;
      .style-container {
        height: 100px;
        .element {
          border-radius: 10px;
          img {
            width: 100px;
            object-fit: cover;
            height: 100px;
          }
        }
      }
    }
  }
}
</style>