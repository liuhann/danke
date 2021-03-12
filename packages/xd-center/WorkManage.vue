<template>
  <div class="work- body">
    <div class="content-title">作品管理</div>
    <div class="work-list">
      <el-table :data="works" size="mini" stripe style="width: 100%">
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="creator" width="120px" label="作者"></el-table-column>
        <el-table-column label="首页">
          <template slot-scope="scope">
            <i v-if="scope.row.system && scope.row.system.site" class="el-icon-s-home" />
          </template>
        </el-table-column>
        <el-table-column label="app" prop="channels" />
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openWork(scope.row)">打开</el-button>
            <el-button type="text" size="small" @click="snapShotWork(scope.row)">预览</el-button>
            <el-button type="text" size="small" @click="editWorkProp(scope.row)">编辑属性</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form v-if="currentWork" label-width="80px">
        {{ currentWork }}
        <el-form-item label="名称">
          <el-input v-model="currentWork.title"></el-input>
        </el-form-item>
        <el-form-item v-if="currentWork.system" label="首页展示">
          <el-checkbox v-model="currentWork.system.site">是</el-checkbox>
        </el-form-item>
        <el-form-item v-if="currentWork.system" label="作为模板">
          <el-checkbox v-model="currentWork.system.template">是</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="trashWork">刪除</el-button>
        <el-button type="primary" @click="confirmWork">确 定</el-button>
      </span>
    </el-dialog>

    <el-pagination :current-page.sync="page" :page-size="size" :total="total" @current-change="pageChange" />
  </div>
</template>

<script>
import { Pagination, Button, Table, TableColumn, Dialog, Form, FormItem, Input, Checkbox, Select, Option } from 'element-ui'
import RestDAO from '../utils/restdao.js'
import channels from '../site/channels'

export default {
  name: 'Work',
  components: {
    [Pagination.name]: Pagination,
    [Dialog.name]: Dialog,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [Checkbox.name]: Checkbox,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button
  },
  data () {
    return {
      currentWork: { },
      channels,
      dialogVisible: false,
      works: [],
      page: 1,
      size: 20,
      total: 0
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.trashdao = new RestDAO(this.ctx, 'trash/work')
  },
  mounted () {
    this.fetchWorks()
  },
  methods: {
    confirmWork () {
      this.workdao.patch(this.currentWork.id, {
        system: this.currentWork.system
      })
    },

    async trashWork () {
      const fullWork = await this.workdao.getOne(this.currentWork.id)
      const id = fullWork._id
      delete fullWork._id
      await this.trashdao.create(fullWork)
      await this.workdao.delete(id)
      this.dialogVisible = false
      this.fetchWorks()
    },

    editWorkProp (work) {
      if (!work.system || !work.system.app) {
        this.$set(work, 'system', {
          site: false,
          template: false,
          app: ''
        })
      }
      this.currentWork = work
      this.dialogVisible = true
    },

    async fetchWorks () {
      if (this.ctx.user && this.ctx.user.id === '15011245191') {
        const result = await this.workdao.list({
          projection: 'updated,created,creator,name,id,viewBox,likes,comments,name,title,system,channels',
          page: this.page,
          count: this.size
        })
        this.works = result.list
        this.total = result.total
      }
    },
    pageChange () {
      this.fetchWorks()
    },
    openWork (work) {
      window.open('/xd?work=' + work.id)
    },
    snapShotWork(work) {
      window.open('/work/snapshot/' + work.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.work-item {
  height: 40px;
  line-height: 40px;
  display: flex;
  .title {
    width: 300px;
  }
  .is-home {
    text-align: center;
    width: 40px;
  }
}
</style>
