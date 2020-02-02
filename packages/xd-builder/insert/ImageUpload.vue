<template>
<div id="my-uploaded-images">
  <el-upload
    :auto-upload="false" action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    multiple
    class="upload-container"
    :on-change="fileChoosed">
    <el-button type="primary">点击上传图片/视频</el-button>
  </el-upload>
  <div class="image-list">
    <div class="image-item" v-for="image in images" :key="image._id">
      <img :src="getImageUrl(image.url)" draggable @dragstart="dragStart(image, $event)"/>
    </div>
  </div>
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import imageUtils from '../mixins/imageUtils.js'
import ImageDAO from '../utils/imagedao'
import ky from 'ky'
import { Upload, Button } from 'element-ui'
export default {
  mixins: [imageUtils],
  components: {
    [Button.name]: Button,
    [Upload.name]: Upload
  },
  data () {
    return {
      page: 1,
      pageSize: 20,
      IMG_SERVER: this.ctx.IMG_SERVER,
      images: []
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.restdao = new RestDAO(this.ctx, 'danke/image')
  },

  mounted () {
    this.loadImages()
  },

  methods: {
    async loadImages () {
      const result = await this.restdao.list({
        page: 1,
        count: 20
      })
      this.images = result.list
    },

    // may be choose multiple files, should do auto upload on choose
    // each file would trigger fileChoosed event
    async fileChoosed (file, uploadFiles) {
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
    },

    dragStart (image, ev) {
      // stringify image info as text
      ev.dataTransfer.setData('Text', JSON.stringify(image))
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
    .image-item {
      width: 100px;
      height: 100px;
      margin: 3px;
    }
  }
}
</style>
