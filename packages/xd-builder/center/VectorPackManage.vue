<template>
  <div class="vector-packs section">
    <div class="content-title">包列表</div>
    <div class="columns">
      <div class="column is-narrow" style="width: 320px;">
        <el-button size="small" @click="newPack">增加包</el-button>
        <el-table :data="packs" size="mini" stripe style="width: 100%" @row-click="packClicked">
          <el-table-column prop="name" label="标题"></el-table-column>
        </el-table>
        <el-pagination :current-page.sync="page" :page-size="size" :total="total" @current-change="pageChange" />
      </div>
      <div v-if="currentPack" class="column">
        <h2 class="title is-3">{{ currentPack.name }} <el-button @click="editPack">编辑</el-button></h2>
        <el-upload
          :auto-upload="false"
          action="none"
          multiple
          drag
          accept="image/*"
          :show-file-list="false"
          class="upload-container mt-2"
          :on-change="(file, uploadFiles) => fileChoosed(file, uploadFiles)"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-button @click="addHTMLVector">增加HTML</el-button>

        <div class="columns mt-3 is-multiline">
          <div v-for="vector in packVectors" :key="vector._id" class="column is-1">
            <img v-if="vector.url" :src="getImageUrl(vector.url)" @dblclick="setAsPackCover(vector.url)">
            <div v-if="vector.html" class="svg-container" :style="variableValues(vector)">
              <div class="styled-box" v-html="vector.html">
              </div>
            </div>
            <div class="has-text-centered">
              <el-button v-if="vector.html" size="mini" type="text" @click="editVector(vector)">编辑</el-button>
              <el-button size="mini" type="text" @click="deleteVector(vector)">删除</el-button>
            </div>
          </div>
        </div>
        <div>Icons made by <a href="https://www.flaticon.com/authors/ddara" title="dDara">dDara</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
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
    </div>
  </div>
</template>

<script>
import { Pagination, Button, Table, TableColumn, Dialog, Form, FormItem, Input, Checkbox, Select, Option, Upload, Message } from 'element-ui'
import RestDAO from '../../utils/restdao.js'
import channels from '../../site/channels'
import getImageSize from '../../utils/imageSize'
import ImageDAO from '../../utils/imagedao'
import { getImageUrl } from '../mixins/imageUtils'
import { getVariableStyle } from '../mixins/renderUtils'

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
      packVectors: [],
      packs: [],
      page: 1,
      size: 20,
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
    addHTMLVector () {
      window.open('/h5/edit?pack=' + this.currentPack._id)
    },

    editVector (vector) {
      window.open('/h5/edit?id=' + vector._id)
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

      Message.success('已经删除' + vector._id)
    },

    newPack () {
      this.currentPack = {
        name: '未命名',
        type: 'vector',
        previews: []
      }
      this.dialogVisible = true
    },

    editPack () {
      this.dialogVisible = true
    },
    setAsPackCover (url) {
      this.currentPack.previews = [url]
      this.savePack()
    },
    // may be choose multiple files, should do auto upload on choose
    // each file would trigger fileChoosed event
    async fileChoosed (file, uploadFiles) {
      console.log('file choosed', file, uploadFiles)
      const imageObject = {
        name: file.name,
        size: file.size,
      }
      let result = await this.imagedao.uploadBlob(file.raw, `public/vector/${this.currentPack._id}/${file.name}`, true)
      imageObject.url = result.name
      imageObject.pack = this.currentPack._id
      const size = await getImageSize(file.raw)
      imageObject.w = size.width
      imageObject.h = size.height
      // write file info
      await this.restdao.create(imageObject)
    },

    async fetchPackVectors () {
      const result = await this.restdao.list({
        pack: this.currentPack._id,
        count: 10000
      })

      this.packVectors = result.list
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
