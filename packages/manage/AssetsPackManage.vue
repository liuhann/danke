<template>
  <div class="vector-packs section">
    <div class="content-title">包列表</div>
    <div class="columns">
      <div class="column is-narrow" style="width: 320px;">
        <el-button size="small" type="primary" @click="newPack">增加包</el-button>

        <ul>
          <li v-for="pack in packs" :key="pack.id" @click="packClicked(pack)">
            {{ pack.name }}
          </li>
        </ul>
        <el-pagination :current-page.sync="page" :page-size="size" :total="total" @current-change="pageChange" />
      </div>
      <div v-if="currentPack" class="column" style="flex: 1;">
        <h2 class="title is-3">{{ currentPack.name }}  {{ currentPack.tags }}</h2>
        <div class="actions">
          <el-button-group>
            <el-button size="mini" @click="editPack">编辑</el-button>
            <el-button size="mini" @click="deleteAllInPack">全部删除</el-button>
            <el-button size="mini" @click="deletePack">删除包</el-button>
            <el-button size="mini" @click="newVector">新的</el-button>
          </el-button-group>

          <div style="display: inline-block;" class="ml-2">
            <el-upload
              :auto-upload="false"
              action="none"
              multiple
              accept="image/*"
              :show-file-list="false"
              class="upload-container mt-2"
              :on-change="(file, uploadFiles) => fileChoosed(file, uploadFiles)"
            >
              <el-button type="primary">上传文件</el-button>
            </el-upload>
          </div>
        </div>
        <collapable-list :column="8" :items="packVectors" :item-commands="itemCommands" :item-padding="10" :style-item-content="{
          borderRadius: '10px',
          boxShadow: '0 1px 6px 0 rgb(32 33 36 / 28%)'
        }" @command="onItemCommand"
        />
        <el-pagination :current-page.sync="vectorPage" :page-size="vectorPageSize" :total="vectorPageTotal" @current-change="fetchPackVectors" />
      </div>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <el-form v-if="currentPack" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="currentPack.name"></el-input>
          </el-form-item>
          <el-form-item label="预览">
            <el-input v-model="currentPack.url"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="currentPack.tags" multiple allow-create>
              <el-option v-for="tag in assetsTags" :key="tag.value" :label="tag.label" :value="tag.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="currentPack.type" size="small">
              <el-option label="矢量" value="vector"></el-option>
              <el-option label="照片" value="image"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePack">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Pagination, Button, Table, TableColumn, Dialog, Form, FormItem, Input, Checkbox, Select, Option, Upload, Message, Loading, MessageBox } from 'element-ui'
import RestDAO from '../utils/restdao.js'
import getImageSize from '../utils/imageSize'
import ImageDAO from '../utils/imagedao'
import { getImageUrl } from '../utils/getImageUrl'
import { getVariableStyle } from '../xd-builder/mixins/renderUtils'
import assetsTags from './assets-tags.js'
import CollapableList from '../common/components/CollapableList.vue'

export default {
  name: 'AssetsPackManage',
  components: {
    CollapableList,
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
      itemCommands: [{
        label: '删除',
        value: 'delete'
      }, {
        label: '设置为封面',
        value: 'cover'
      }, {
        label: '设置内容',
        value: 'content'
      }],
      packType: 'vector',
      assetsTags,
      currentPack: null,
      dialogVisible: false,
      packVectors: [],
      packs: [],
      page: 1,
      size: 20,
      vectorPage: 1,
      vectorPageSize: 20,
      vectorPageTotal: 0,
      total: 0
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
    this.imagedao = new ImageDAO(this.ctx)
  },
  mounted () {
    this.fetchPacks()
  },
  methods: {
    getImageUrl,
    variableValues (svg) {
      return getVariableStyle(svg.variables)
    },
    packClicked (row) {
      this.currentPack = row
      this.fetchPackVectors()
    },

    newVector () {
      window.open('/vector/edit?pack=' + this.currentPack._id)
    },

    async onItemCommand (payload) {
      if (payload.cmd === 'cover') {
        this.setAsPackCover(payload.item.url)
      }
      if (payload.cmd === 'content') {
        if (!payload.item.url || payload.item.url.endsWith('.svg')) {
          window.open('/vector/edit?id=' + payload.item._id)
        }
      }
      if (payload.cmd === 'delete') {
        await MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.deleteVector(payload.item)
        await this.fetchPackVectors()
      }
    },

    savePack () {
      this.packdao.createOrPatch(this.currentPack)
      Message.success('保存完成')
      this.dialogVisible = false
    },
    async deleteVector (vector) {
      if (vector.url) {
        await this.imagedao.removeBlob(vector.url)
      }
      await this.restdao.delete(vector)
      Message.success('已经删除' + vector.name)
    },

    newPack () {
      this.currentPack = {
        name: '未命名',
        type: 'vector',
        tags: [],
        author: '',
        url: '',
        previews: []
      }
      this.dialogVisible = true
    },

    pageChange () {
      this.fetchPacks()
    },

    editPack () {
      this.dialogVisible = true
    },
    setAsPackCover (url) {
      this.currentPack.url = url
      this.savePack()
    },
    // may be choose multiple files, should do auto upload on choose
    // each file would trigger fileChoosed event
    async fileChoosed (file, uploadFiles) {
      const imageObject = await this.imagedao.fileChoosed(file, uploadFiles, `public/${this.packType}/${this.currentPack._id}/${file.name}`)
      imageObject.pack = this.currentPack._id
      await this.restdao.create(imageObject)
      Message.success('已经上传' + imageObject.name)
    },

    async fetchPackVectors () {
      const result = await this.restdao.list({
        pack: this.currentPack._id,
        page: this.vectorPage,
        count: this.vectorPageSize
      })
      this.vectorPageTotal = result.total

      this.packVectors = result.list
    },

    async deleteAllInPack () {
      let loadingInstance = Loading.service({
        text: '正在删除中'
      })
      for (let vector of this.packVectors ) {
        await this.deleteVector(vector)
      }
      loadingInstance.close()
    },

    async fetchPacks () {
      if (this.ctx.user && this.ctx.user.id === '15011245191') {
        const result = await this.packdao.list({
          page: this.page,
          count: this.size,
          type: this.packType
        })
        this.packs = result.list
        this.total = result.total
      }
    },

    async deletePack () {
      const result = await this.restdao.list({
        pack: this.currentPack._id,
        page: 1,
        count: 1000
      })
      const vectors = result.list

      if (vectors.length) {
        await MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        let loadingInstance = Loading.service({
          text: '正在删除中'
        })
        for (let vector of this.packVectors ) {
          await this.deleteVector(vector)
        }
        await this.packdao.delete(this.currentPack)
        loadingInstance.close()
        Message.success('已经删除pack')
        this.currentPack = null
        this.packVectors = []
      }
    },

    async excuteBulk () {
      for (let colors of darks) {
        if (colors.length >=2) {
          const vector = {
            "w":100,
            "h":100,
            "html": `<div style=\"background: linear-gradient(var(--a), var(--c1) 0%, var(--c2) 100%);width: 100%;height: 100%\"></div>`,
            "variables":[
                {"name":"c1","type":"color","value": colors[0],"label":"颜色1"},
                {"name":"c2","value":colors[1],"label":"颜色2","type":"color"},
                {"name":"a","value":"0","label":"角度","type":"deg"}
            ],
            "pack":"5fd6fa3a922370cef95fa39a"
          }
          await this.restdao.create(vector)
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.vector-packs {
  .columns {
    display: flex;
  }
  .column.is-narrow {
    width: 100px;
    height: 130px;
    img {
      width: 100px;
      height: 80px;
      object-fit: cover;
    }
    .svg-container {
      width: 100%;
      height: 100%;
      .styled-box {
        width: 100%;
        height: 100%;
      }
    }
  }
}
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
