<template>
<div id="my-uploaded-images">
  <div class="album-list" v-if="!currentAlbum">
    <div class="album" v-for="album in albums" :key="album._id">
      <div class="album-title">
        <div class="text">{{album.name}}</div>
        <div class="more" @click="openAlbum(album)">打开</div>
      </div>
      <div class="album-images">
        <div class="item add">
          <el-upload
            :auto-upload="false"
            action="none"
            accept="image/*"
            :show-file-list="false"
            multiple
            class="upload-container"
            :on-change="(file, uploadFiles) => fileChoosed(file, uploadFiles, album)">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div
          v-for="(image, index) in album.covers" :key="index"
          class="item image" draggable @dragstart="dragStart(image, $event)">
          <img :src="getImageUrl(image.url)" />
        </div>
      </div>
    </div>
    <div class="album">
      <div class="album-title">
        <div class="more" v-show="!showNewAlbumName" @click="showNewAlbumName = true">+新增图库</div>
        <div class="input" v-show="showNewAlbumName">
          <el-input size="mini" v-model="newAlbumName"/>
        </div>
        <div class="confirm" v-show="showNewAlbumName" @click="confirmAddNewAlbum">确定</div>
        <div class="confirm" v-show="showNewAlbumName" @click="showNewAlbumName = false">取消</div>
      </div>
    </div>
  </div>

  <div class="album-opened album" v-if="currentAlbum">
    <div class="album-title">
      <div class="text">{{currentAlbum.name}}</div>
      <div class="trash" v-if="currentAlbum.covers.length === 0" @click="removeAlbum">删除</div>
      <div class="more" @click="closeAlbum">关闭</div>
    </div>
    <div class="album-images">
      <div class="item add">
        <el-upload
          :auto-upload="false"
          action="none"
          accept="image/*"
          :show-file-list="false"
          multiple
          class="upload-container"
          :on-change="(file, uploadFiles) => fileChoosed(file, uploadFiles, currentAlbum)">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div
        v-for="(image, index) in albumImages" :key="index"
        class="item image" draggable @dragstart="dragStart(image, $event)">
        <img :src="getImageUrl(image.url)" />
        <i class="el-icon-delete" @click="removeImage(image)"></i>
      </div>
    </div>
    <el-pagination background :total="total" :page-size="pageSize" @current-change="loadAlbumImages" :current-page.sync="page" layout="prev, pager, next" />
  </div>
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import { getImageUrl } from '../mixins/imageUtils.js'
import ImageDAO from '../../utils/imagedao'
import ky from 'ky'
import { Upload, Button, Pagination, Checkbox, Input } from 'element-ui'
export default {
  components: {
    [Button.name]: Button,
    [Upload.name]: Upload,
    [Pagination.name]: Pagination,
    [Checkbox.name]: Checkbox,
    [Input.name]: Input
  },
  data () {
    return {
      draggingImage: false,
      albums: [],
      IMG_SERVER: this.ctx.IMG_SERVER,
      showNewAlbumName: false,
      newAlbumName: '',
      currentAlbum: null,
      albumImages: [],
      page: 1,
      pageSize: 30,
      total: 0,
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.albumdao = new RestDAO(this.ctx, 'danke/pack')
    this.restdao = new RestDAO(this.ctx, 'danke/image')
    this.choosedFiles = []
  },

  mounted () {
    this.loadAlbums()
  },

  methods: {
    getImageUrl,

    async reloadList () {
      if (this.currentAlbum) {

      } else {
        this.loadAlbums()
      }
    },

    async createAlbum () {

    },

    async confirmAddNewAlbum () {
      if (this.newAlbumName) {
        await this.doCreateAlbum(this.newAlbumName)
        this.newAlbumName = ''
        this.showNewAlbumName = false
      }
    },

    async loadAlbums () {
      const result = await this.albumdao.list({
        type: 'album',
        creator: this.ctx.user.id,
      })
      this.albums = result.list.reverse()
      if (this.albums.length === 0) {
        this.doCreateAlbum('默认')
      }
    },

    async openAlbum(album) {
      this.currentAlbum = album
      this.loadAlbumImages()
    },

    async removeAlbum () {
      await this.albumdao.delete(this.currentAlbum)
      this.currentAlbum = null
      this.loadAlbums()
    },

    async closeAlbum () {
      this.currentAlbum = null
      this.loadAlbums()
    },

    async doCreateAlbum (name) {
      const result = await this.albumdao.create({
        type: 'album',
        name: name
      })
      await this.loadAlbums()
    },


    async loadAlbumImages () {
      if (this.currentAlbum) {
        const result = await this.restdao.list({
          album: this.currentAlbum._id,
          page: this.page,
          count: this.pageSize
        })
        this.total = result.total
        result.list.forEach(image => {
          image.checked = false
        })
        this.albumImages = result.list
      }
    },

    // may be choose multiple files, should do auto upload on choose
    // each file would trigger fileChoosed event
    async fileChoosed (file, uploadFiles, album) {
      this.choosedFiles.push(file)
      const result = await this.imagedao.uploadBlob(file.raw, `images`)
      const imageInfo = await ky.get(this.IMG_SERVER + '/' + result.name + '?x-oss-process=image/info').json()
      // write file info
      await this.restdao.create({
        url: result.name,
        name: file.name,
        size: file.size,
        album: album._id,
        height: parseInt(imageInfo.ImageHeight.value),
        width: parseInt(imageInfo.ImageWidth.value)
      })
      file.uploaded = true
      await this.updateAlbumCover(album)

      // 更新已经打开的图集列表
      this.loadAlbumImages()
    },

    async updateAlbumCover (album) {
      const listResult = await this.restdao.list({
        album: album._id,
        page: 1,
        count: 3
      })
      album.covers = listResult.list.map(image => ({
        width: image.width,
        height: image.height,
        url: image.url
      }))
      await this.albumdao.patch(album._id, album)
    },

    async removeImage (image) {
      await this.imagedao.removeBlob(image.url)
      await this.restdao.delete(image)
      this.updateAlbumCover(this.currentAlbum)
      this.loadAlbumImages()
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

  .album {
    .album-title {
      padding: 10px;
      display: flex;
      font-size: 1.5rem;
      line-height: 30px;
      .text {
        flex: 1;
        font-weight: bold;
        color: #fff;
      }
      .more, .confirm, .trash {
        color: #99a9bf;
        cursor: pointer;
        margin-left: 10px;
        &:hover {
          color: rgba(153, 169, 191, 0.6);
        }
      }
      .trash {
        color: #EA4335;
        &:hover {
          color: #ea6463;
        }
      }
      .input {
        margin-right: 10px;
      }
      input {
        background: transparent;
        color: #fff;
        box-shadow: none;
        border: 1px solid #99a9bf;
        padding: 5px;
      }
    }
    .album-images {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 70px;
        height: 70px;
        margin: 4px;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 70px;
          height: 70px;
          object-fit: cover;
          cursor: pointer;
        }
        .el-icon-delete {
          position: absolute;
          right: 2px;
          top: 2px;
          padding: 5px;
          border-radius: 4px;
          background-color: rgba(0,0,0, .7);
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          display: none;
        }
        &:hover {
          .el-icon-delete {
            display: initial;
          }
        }
        &.add {
          border: 1px dashed #99a9bf;
          .upload-container {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #99a9bf;
            font-size: 20px;
          }
        }
      }
    }
  }
  .el-pagination {
    margin: 10px 0;
  }
}
</style>
