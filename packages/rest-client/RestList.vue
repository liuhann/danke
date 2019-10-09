<template>
<div class="rest-list">
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column v-for="column of columns" :key="column"
      :prop="column"
      :label="column">
      <template slot-scope="scope">
        <el-input v-model="scope.row[column]"></el-input>
      </template>
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-button @click="showRow(scope.row)"></el-button>
      </template>
    </el-table-column>

  </el-table>
  <el-pagination></el-pagination>
</div>
</template>

<script>
import { Table, TableColumn, Pagination, Input, Button } from 'element-ui'
import RestDAO from '../common/dao/restdao.js'
export default {
  name: 'DankeAdmin',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Input.name]: Input,
    [Button.name]: Button
  },
  data () {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      projection: 'creator',
      tableData: []
    }
  },
  computed: {
    columns () {
      return this.projection.split(',')
    }
  },
  created () {
    this.restdao = new RestDAO(this.ctx, this.$route.query.path)
    this.projection = this.$route.query.projection
    this.load()
  },
  methods: {
    async load () {
      this.loading = true
      const result = await this.restdao.list({
        page: this.currentPage,
        count: this.pageSize,
        projection: this.projection
      })
      this.loading = false
      this.tableData = result.list
      this.total = result.total
    },
    showRow (r) {
      alert(JSON.stringify(r))
    }
  }
}
</script>

<style scoped>

</style>
