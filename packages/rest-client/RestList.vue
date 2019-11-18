<template>
<div class="rest-list">
  模板地址 <el-input size="mini" v-model="templateUrl" style="width: 300px"></el-input>
  投影 <el-input size="mini" v-model="projection" style="width: 300px"></el-input>
  <el-button size="mini" @click="load">更新</el-button>
  <el-table
    :data="tableData"
    style="width: 100%"
    size="mini"
    stripe>
    <el-table-column v-for="column of columns" :key="column" :show-overflow-tooltip="true"
       :prop="column"
       :label="column">
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-button type="info" size="mini" @click="showRow(scope.row)">属性设置</el-button>
        <el-button type="success" size="mini" @click="applyUrl(scope.row)">打开</el-button>
        <el-button type="danger" size="mini" @click="removeObject(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="修改对象属性" :visible.sync="dialogVisible" fullscreen>
    <el-form ref="form" v-if="objectEditing" :model="objectEditing" label-width="80px" size="mini">
      <!--既有字段的修改-->
      <el-form-item v-for="(value, key) in objectEditing" :label="key" :key="key">
        <el-input v-model="objectEditing[key]" style="width: 400px"></el-input>
      </el-form-item>
      <!--处理新增的字段-->
      <el-form-item v-for="(field, index) in formNewSets" label="新增项" :key="index">
        <el-input v-model="field.key" style="width: 120px"></el-input>
        <el-input v-model="field.value" style="width: 200px"></el-input>
        <el-button type="danger" @click="formNewSets.splice(index, 1)">删除</el-button>
      </el-form-item>
      <!--新增按钮-->
      <el-form-item>
        <el-button type="success" @click="formNewSets.push({key: '', value: ''})">新增</el-button>
      </el-form-item>
      <!--保存与取消-->
      <el-form-item>
        <el-button type="primary" @click="patchObject">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-pagination :page-size.sync="pageSize" :total="total" @current-change="currentChange"/>
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
      projection: 'title,creator,updated',
      templateUrl: '/play/fit/{_id}',
      loading: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      columns: [],
      objectEditing: null,
      dialogVisible: false,
      formNewSets: [],
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

    /**
     * 加载对象实例列表 注意处理含有projection的情况
     **/
    async load () {
      this.loading = true
      let result = null
      // 指定了投影则按投影加载
      if (this.projection) {
        result = await this.restdao.list({
          page: this.currentPage,
          count: this.pageSize,
          projection: this.projection
        })
        this.columns = this.projection.split(',')
        this.columns.push('_id')
      } else {
        // 否则就是全加载 但是只显示_id列
        result = await this.restdao.list({
          page: this.currentPage,
          count: this.pageSize
        })
        this.columns = ['_id']
      }
      this.tableData = result.list
      this.total = result.total
    },

    // 应用对象到url模板并打开url地址
    async applyUrl (object) {
      let url = this.templateUrl

      for (let key in object) {
        url = url.replace(`{${key}}`, object[key])
      }
      window.open(url)
    },

    /**
     * 新增、修改对象属性
     */
    async patchObject () {
      for (let field of this.formNewSets) {
        if (field.key && field.value) {
          this.objectEditing[field.key] = field.value
        }
      }
      await this.restdao.patch(this.objectEditing._id, this.objectEditing)
      this.dialogVisible = false
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
    async removeObject (r) {
      if (confirm('确认删除')) {
        debugger
        await this.restdao.delete(r)
        this.load()
      }
    },
    showRow (r) {
      this.objectEditing = r
      this.dialogVisible = true
    },
    currentChange (page) {
      this.currentPage = page
      this.load()
    }
  }
}
</script>

<style lang="scss">

</style>
