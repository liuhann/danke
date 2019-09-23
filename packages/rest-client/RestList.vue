<template>
<div class="rest-list">
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
  <div class="work-list">
    <table>
      <tr>
        <th style="width: 160px">操作</th>
        <th>标题</th>
        <th>创建者</th>
        <th>shi</th>
      </tr>
      <tr class="one-story" v-for="work in works" :key="work._id">
        <td>
          <a @click="setAsRecommendation(work)">推荐</a>
        </td>
        <td><input style="width: 300px;" v-model="work.title"></td>
        <td>{{work.creator}}</td>
        <td><input v-model="work.updated"></td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
import { Table, TableColumn, Pagination } from 'element-ui'
import RestDAO from '../common/dao/restdao.js'
export default {
  name: 'DankeAdmin',
  components: {
    Table,
    TableColumn,
    Pagination
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      tableData: []
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.loadWorks()
  },
  methods: {
    async loadWorks () {
      this.loading = true
      const result = await this.workdao.list({
        page: this.currentPage,
        count: this.pageSize,
        projection: 'title,creator,updated,system'
      })
      this.loading = false
      this.works = result.list
      this.total = result.total
    },
    async setAsRecommendation (work) {
      await this.workdao.patch(work._id, {
        system: {
          top4: "1"
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
