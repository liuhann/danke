<template>
<div class="rest-list">
  <el-table
    :data="tableData"
    :resizable="false"
    style="width: 100%"
    stripe>
    <el-table-column v-for="column of columns" :key="column" :show-overflow-tooltip="true"
       :prop="column"
       :label="column">
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-button @click="showRow(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="提示" :visible.sync="dialogVisible" fullscreen>
    <el-form ref="form" v-if="objectEditing" :model="objectEditing" label-width="80px" size="mini">
      <el-form-item v-for="(value, key) in objectEditing" :label="key" :key="key">
        <el-input v-model="objectEditing[key]" style="width: 400px"></el-input>
        <el-button>删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-pagination></el-pagination>
</div>
</template>

<script>
import { Table, TableColumn, Pagination, Input, Button, Dialog, Form, FormItem } from 'element-ui'
import RestDAO from '../common/dao/restdao.js'
export default {
  name: 'RestList',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Input.name]: Input,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Form.name]: Form,
    [FormItem.name]: FormItem
  },
  data () {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      columns: [],
      projection: 'creator',
      objectEditing: null,
      dialogVisible: false,
      tableData: []
    }
  },
  computed: {
  },
  created () {
    this.restdao = new RestDAO(this.ctx, this.$route.query.path)
    this.load()
  },
  methods: {
    async load () {
      this.loading = true
      const result = await this.restdao.list({
        page: this.currentPage,
        count: this.pageSize
      })
      this.loading = false
      this.tableData = result.list
      if (this.tableData.length) {
        this.columns = this.analysisFromObject(this.tableData[0])
      }
      console.log(this.columns)
      this.total = result.total
    },

    analysisFromObject (o) {
      const rawFields = []
      for (let k in o) {
        if (typeof o[k] !== 'object') {
          rawFields.push(k)
        }
      }
      return rawFields
    },
    showRow (r) {
      this.objectEditing = r
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss">

</style>
