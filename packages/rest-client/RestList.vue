<template>
  <div class="rest-list">
    REST
    <el-select v-model="restPath" style="width: 300px">
      <el-option v-for="rest in restUrls" :key="rest" :value="rest" :label="rest"></el-option>
    </el-select>
    <el-button size="mini" @click="load">
      列举
    </el-button>
    <el-button size="mini" @click="edit">
      新增
    </el-button>
    <el-table :data="tableData" style="width: 100%" size="mini" stripe>
      <el-table-column v-for="column of columns" :key="column"
                       :show-overflow-tooltip="true"
                       :prop="column"
                       :label="column"
      >
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="edit(scope.row)">
            属性设置
          </el-button>
          <el-button type="success" size="mini" @click="applyUrl(scope.row)">
            打开
          </el-button>
          <el-button type="danger" size="mini" @click="removeObject(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改对象属性" :visible.sync="dialogVisible" fullscreen @opened="dialogOpened">
      <div id="editor">
      </div>
      <el-button type="primary" @click="patchObject">
        保存
      </el-button>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
    </el-dialog>
    <el-pagination :page-size.sync="pageSize" :total="total" @current-change="currentChange" />
  </div>
</template>

<script>
import { Table, TableColumn, Pagination, Input, Button, Dialog, Select, Option } from 'element-ui'
import RestDAO from '../utils/restdao.js'

import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/monokai'

export default {
  name: 'RestList',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Input.name]: Input,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data () {
    return {
      restUrls: ['danke/work', 'danke/font', 'danke/pack'],
      projection: '',
      restPath: '',
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
  },
  methods: {
    initEditor () {
      if (!this.editor) {
        this.editor = ace.edit('editor')
        this.editor.getSession().setMode('ace/mode/json')
        this.editor.setTheme('ace/theme/monokai')
      }
    },
    /**
     * 加载对象实例列表 注意处理含有projection的情况
     **/
    async load () {
      this.restdao = new RestDAO(this.ctx, this.restPath)
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
        this.columns = ['_id','name']
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
      const patched = JSON.parse(this.editor.getValue())

      if (this.objectEditing._id) {
        delete patched._id
        await this.restdao.patch(this.objectEditing._id, patched)
      } else {
        await this.restdao.create(patched)
      }
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
        await this.restdao.delete(r)
        this.load()
      }
    },
    edit (r) {
      this.objectEditing = r || {}
      this.dialogVisible = true
    },
    currentChange (page) {
      this.currentPage = page
      this.load()
    },

    dialogOpened () {
      this.initEditor()
      this.editor.setValue(JSON.stringify(this.objectEditing, null,2))
    }
  }
}
</script>

<style lang="scss">

#editor {
  width: 100%;
  height: 800px;
}
</style>
