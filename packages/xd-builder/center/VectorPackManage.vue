<template>
  <div class="vector-packs">
    <div class="content-title">包列表</div>
    <div class="columns">
      <div class="column is-narrow" style="width: 300px;">
        <el-button @click="newPack">增加包</el-button>
        <el-table :data="packs" size="mini" stripe style="width: 100%" @row-click="packClicked">
          <el-table-column prop="name" label="标题"></el-table-column>
        </el-table>
      </div>
      <div class="column">
        <h2 class="title is-3">{{ currentPack.name }}</h2>
        <el-upload>
        </el-upload>
        <div class="columns">
        </div>
      </div>
    </div>
    <div class="pack">
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form v-if="currentPack" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="currentPack.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePack">确 定</el-button>
      </span>
    </el-dialog>

    <el-pagination :current-page.sync="page" :page-size="size" :total="total" @current-change="pageChange" />
  </div>
</template>

<script>
import { Pagination, Button, Table, TableColumn, Dialog, Form, FormItem, Input, Checkbox, Select, Option, Upload } from 'element-ui'
import RestDAO from '../../utils/restdao.js'
import channels from '../../site/channels'

export default {
  name: 'Work',
  components: {
    [Upload.name]: Upload,
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
      currentPack: null,
      dialogVisible: false,
      packs: [],
      page: 1,
      size: 20,
      total: 0
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.trashdao = new RestDAO(this.ctx, 'trash/work')
  },
  mounted () {
    this.fetchPacks()
  },
  methods: {
    packClicked (row) {
      this.currentPack = row
    },
    savePack () {
      this.packdao.createOrPatch(this.currentPack)
    },
    newPack () {
      this.currentPack = {
        name: '未命名',
        type: 'vector',
        previews: []
      }
      this.dialogVisible = true
    },
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

    async fetchPacks () {
      if (this.ctx.user && this.ctx.user.id === '15011245191') {
        const result = await this.packdao.list({
          page: this.page,
          count: this.size
        })
        this.packs = result.list
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
