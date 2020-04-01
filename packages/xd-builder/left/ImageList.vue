<template>
<div id="my-uploaded-images">
  <el-upload
    :auto-upload="false" action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    ref="imageUpload"
    multiple
    class="upload-container"
    :on-change="fileChoosed">
    <el-button type="primary">点击上传图片/视频</el-button>
  </el-upload>
  <div class="image-list">
    <div class="hint">拖拽图片到设计取</div>
    <div class="image-item" v-for="image in images" :key="image._id" draggable @dragstart="dragStart(image, $event)" @dragend="dragEnd(image)">
      <img :src="getImageUrl(image.url)" />
      <i class="btn-delete el-icon-delete" @click="deleteImage(image)"/>
    </div>
  </div>
  <el-pagination background :total="total" :page-size="pageSize" @current-change="loadImages" :current-page.sync="page" layout="prev, pager, next" />
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import { getImageUrl } from '../mixins/imageUtils.js'
import ImageDAO from '../../utils/imagedao'
import ky from 'ky'
import { Upload, Button, Pagination } from 'element-ui'
export default {
  components: {
    [Button.name]: Button,
    [Upload.name]: Upload,
    [Pagination.name]: Pagination
  },
  data () {
    return {
      draggingImage: false,
      page: 1,
      pageSize: 6,
      total: 0,
      IMG_SERVER: this.ctx.IMG_SERVER,
      images: []
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.restdao = new RestDAO(this.ctx, 'danke/image')
    this.choosedFiles = []
  },

  mounted () {
    this.loadImages()
  },

  methods: {
    getImageUrl,

    handleCurrentChange () {

    },
    async loadImages () {
      const result = await this.restdao.list({
        page: this.page,
        count: this.pageSize
      })
      this.total = result.total
      this.images = result.list
    },

    // may be choose multiple files, should do auto upload on choose
    // each file would trigger fileChoosed event
    async fileChoosed (file, uploadFiles) {
      this.choosedFiles.push(file)
      const result = await this.imagedao.uploadBlob(file.raw, `images`)
      const imageInfo = await ky.get(this.IMG_SERVER + '/' + result.name + '?x-oss-process=image/info').json()
      // write file info
      await this.restdao.create({
        url: result.name,
        name: file.name,
        size: file.size,
        height: parseInt(imageInfo.ImageHeight.value),
        width: parseInt(imageInfo.ImageWidth.value)
      })
      file.uploaded = true
      let allUploaded = true
      for (let file of this.choosedFiles) {
        if (!file.uploaded) {
          allUploaded = false
          break
        }
      }
      if (allUploaded) {
        this.loadImages()
      }
    },

    async deleteImage (image) {
      await this.imagedao.removeBlob(image.url)
      await this.restdao.delete(image)
      this.loadImages()
    },

    dragStart (image, ev) {
      // stringify image info as text
      ev.dataTransfer.setData('Text', JSON.stringify(image))
      this.draggingImage = true
    },

    dragEnd () {
      this.draggingImage = false
    }
  }
}
</script>

<style lang="scss">
#my-uploaded-images {
  .upload-container {
    display: flex;
    justify-content: center;
    padding: 10px 0px;
  }
  .image-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .image-item {
      width: 110px;
      height: 110px;
      background: #000;
      position: relative;
      margin-bottom: 1rem;
      .btn-delete {
        position: absolute;
        right: 5px;
        top: 5px;
        color: #fff;
        opacity: 0;
        transition: opacity .3s ease-out;
        background-color: rgba(0,0,0, .8);
        cursor: pointer;
        font-size: 14px;
        border-radius: 4px;
        padding: 5px;
      }
      &:hover {
        .btn-delete {
          opacity: 1;
        }
      }
      img {
        object-fit: contain;
        width: 110px;
        height: 110px;
      }
    }
  }
  .el-pagination {
    margin: 10px 0;
  }
}
</style>
