<template>
  <div class="left-aside-content">
    <div class="search-box">
      <el-input v-model="searchValue" class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="left-block">
      <div
        v-for="(html, index) in htmls"
        :key="index"
        class="object-item" draggable @dragstart="dragStart(html, $event)"
      >
        <div class="shape" :style="variableValues(html)" v-html="html.html" />
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

<style scoped>

</style>