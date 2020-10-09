<template>
  <div class="left-aside-content">
    <div class="search-box">
      <el-input v-model="searchValue" class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="list-wrapper">
      <div class="list-container">
        <div
          v-for="(html, index) in htmls"
          :key="index"
          class="html-container" draggable @dragstart="dragStart(html, $event)"
        >
          <div class="shape" :style="variableValues(html)" v-html="html.html" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao'

export default {
  name: "PublicHTMLListVue",
  data () {
    return {
      currentPage: 1,
      total: 100000000000,
      pageCount: 20,
      fetching: false,
      searchValue: '',
      htmls: []
    }
  },
  created () {
    this.dao = new RestDAO(this.ctx, 'danke/h5')
  },
  mounted () {
    this.fetchMore()
  },
  methods: {
    dragStart (html, ev) {
      ev.dataTransfer.setData('Text', JSON.stringify(html))
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

    async fetchMore () {
      if (this.htmls.length === this.total) {
        return
      }
      if (this.fetching) {
        return
      }

      this.fetching = true
      const result = await this.dao.list({
        page: this.currentPage,
        count: this.pageCount
      })
      this.currentPage ++
      this.total = result.total
      this.htmls = this.htmls.concat(result.list)
      this.fetching = false
    },
  }
}
</script>

<style lang="scss">
.html-container {
  margin: 4px;
  width: 104px;
  height: 104px;
  background: #1b1b1b;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  svg {
    width: 80%;
    height: 80%;
  }
}
</style>
