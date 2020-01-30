<template>
<el-dialog title="选择图片" top="5vh" :visible.sync="dialogVisible" :modal-append-to-body="true" :append-to-body="true">
  <el-tabs v-model="activeName">
    <el-tab-pane label="我的图片" name="my-gallery">
      <div style="margin-bottom: 5px;">
        <el-upload
          :auto-upload="false" action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-change="fileChoosed">
          <el-button  size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <rest-list rest="danke/image" ref="myImageList"
         column="is-one-fifth-tablet is-one-third-mobile" :query="{creator: user}" :with-pagination="false">
        <template v-slot:item="{ item }">
          <div class="media" @click="chooseImage(item.url)" :class="currentChooseImage===item.url? 'current': ''">
            <div class="image" :class="item.url.endsWith('svg')? 'svg': ''" :title="item.name">
              <img :src="getImageUrl(item.url)">
            </div>
          </div>
        </template>
      </rest-list>
    </el-tab-pane>
    <el-tab-pane label="样例图片" name="public-gallery">

    </el-tab-pane>
  </el-tabs>
  <el-button size="mini" type="success" @click="confirm">选择</el-button>
</el-dialog>
</template>

<script>
import RestList from '../common/components/RestList'
import { Dialog, TabPane, Tabs, Upload, Button } from 'element-ui'
import RestDAO from '../common/dao/restdao'
export default {
  name: 'DialogImageChoose',
  components: {
    [Dialog.name]: Dialog,
    [Upload.name]: Upload,
    [TabPane.name]: TabPane,
    [Tabs.name]: Tabs,
    [Button.name]: Button,
    RestList
  },
  data () {
    return {
      currentChooseImage: null,
      activeName: 'my-gallery',
      dialogVisible: false,
      user: this.ctx.user ? this.ctx.user.id : 'anonymous',
      IMG_SERVER: this.ctx.IMG_SERVER
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.restdao = new RestDAO(this.ctx, 'danke/image')
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    async fileChoosed (file) {
      const result = await this.imagedao.uploadBlob(file.raw, `images`)
      await this.restdao.create({
        url: result.name,
        name: file.name,
        size: file.size
      })
      this.$refs.myImageList.refresh()
    },

    confirm () {
      if (this.currentChooseImage) {
        this.$emit('input', this.IMG_SERVER + '/' + this.currentChooseImage)
        this.dialogVisible = false
      }
    },
    deleteImage () {

    },
    chooseImage (url) {
      this.currentChooseImage = url
    },
    getImageUrl (url) {
      if (url.endsWith('.svg')) {
        return this.IMG_SERVER + '/' + url
      } else {
        return this.IMG_SERVER + '/' + url + '?x-oss-process=image/format,jpg/quality,Q_80/resize,m_fill,h_200,w_200'
      }
    }
  }
}
</script>

<style lang="scss">
.el-dialog__body {
  padding: 10px 20px;
}
div.media {
  margin: 0 10px 10px 0px;
  padding-bottom:100%;
  background: #fff;
  border-radius: 2px;
  border: 1px solid #fefefe;
  box-shadow: 0 1px 2px rgba(0,0,0,0.07);
  overflow: hidden;
  height: 0;
  position: relative;
  &.current {
    border: 2px solid #409EFF;
  }
  div.image {
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    padding: 5px;
  &.svg {
     padding: 10px;
   }
  }
}
</style>
