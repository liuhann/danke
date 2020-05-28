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
        <div class="confirm" v-show="showNewAlbumName" @click="confirmAddNewAlbum"><i class="el-icon-check"/></div>
        <div class="confirm" v-show="showNewAlbumName" @click="showNewAlbumName = false"><i class="el-icon-close"/></div>
      </div>
    </div>
  </div>

  <div class="album-opened album" v-if="currentAlbum">
    <div class="album-title" v-if="!albumEditing">
      <div class="more" @click="closeAlbum"><i class="el-icon-arrow-left"/></div>
      <div class="text">{{currentAlbum.name}} <span class="tag" v-if="currentAlbum.mask">mask</span> <span class="tag" v-if="currentAlbum.shared">shared</span></div>
      <div class="edit" @click="editAlbum">
        <i class="el-icon-edit"/>
      </div>
      <div class="trash" @click="removeAlbum">
        <i class="el-icon-delete"/>
      </div>
    </div>
    <div class="album-editing" v-if="albumEditing">
      <div class="input">
        <el-input size="mini" v-model="currentAlbum.name"/>
      </div>
      <div class="field">
        <el-checkbox v-model="currentAlbum.mask">遮罩</el-checkbox>
        <el-checkbox v-model="currentAlbum.shared">分享</el-checkbox>
        <div class="confirm">
          <div class="icon-btn" @click="confirmAlbumEditing">
            <i class="el-icon-check"/>
          </div>
          <div class="icon-btn" @click="albumEditing = false">
            <i class="el-icon-close"/>
          </div>
        </div>
      </div>
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
import { Upload, Button, Pagination, Checkbox, Input, Popconfirm, Message } from 'element-ui'
export default {
  components: {
    [Button.name]: Button,
    [Upload.name]: Upload,
    [Pagination.name]: Pagination,
    [Checkbox.name]: Checkbox,
    [Input.name]: Input,
    [Popconfirm.name]: Popconfirm
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
      choosedFiles: [],
      albumEditing: false
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.albumdao = new RestDAO(this.ctx, 'danke/pack')
    this.restdao = new RestDAO(this.ctx, 'danke/image')
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
        creator: this.ctx.user.id
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


    editAlbum () {
      this.albumEditing = true
    },

    async confirmAlbumEditing () {
      await this.albumdao.patch(this.currentAlbum._id, {
        name: this.currentAlbum.name,
        mask: this.currentAlbum.mask,
        shared: this.currentAlbum.shared
      })

      Message.success('图库信息已保存')
      this.albumEditing = false
    },

    async shareAlbum () {
      this.currentAlbum.shared = true
      await this.albumdao.patch(this.currentAlbum._id, {
        shared: true
      })
    },

    async removeAlbum () {
      if (this.albumImages.length === 0) {
        await this.albumdao.delete(this.currentAlbum)
        this.currentAlbum = null
        this.loadAlbums()
      }
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
      const choose = {
        uploaded: false,
        name: file.name,
        size: file.size
      }
      this.choosedFiles.push(choose)
      const result = await this.imagedao.uploadBlob(file.raw, `images`)
      const imageObject = {
        url: result.name,
        name: file.name,
        size: file.size,
        album: album._id,
      }
      if (file.name.endsWith('svg')) {
      } else {
        const imageInfo = await ky.get(this.IMG_SERVER + '/' + result.name + '?x-oss-process=image/info').json()
        Object.assign(imageObject, {
          height: parseInt(imageInfo.ImageHeight.value),
          width: parseInt(imageInfo.ImageWidth.value)
        })
      }
      // write file info
      await this.restdao.create(imageObject)
      choose.uploaded = true
      if (this.choosedFiles.filter(file => !file.uploaded).length === 0) {
        await this.updateAlbumCover(album)
        // 更新已经打开的图集列表
        this.loadAlbumImages()
      }
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
        name: image.name,
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
      padding: 10px 0;
      display: flex;
      font-size: 1.5rem;
      line-height: 30px;
      .text {
        flex: 1;
        font-weight: bold;
        color: #fff;
      }
      .tag {
        font-size: 10px;
        font-weight: normal;
        background-color: rgba(0,0,0, .5);
        border-radius: 5px;
        margin-left: 5px;
        padding: 0 5px;
        position: relative;
        top: -5px;
      }
      .edit, .trash, .more {
        margin-right: 12px;
        color: #99a9bf;
        cursor: pointer;
        &:hover {
          color: rgba(153, 169, 191, 0.6);
        }
      }
      .trash {
        &:hover {
          color: #ea6463;
        }
      }
      .input {
        margin-right: 10px;
        flex: 1;
      }

    }
    .album-editing {
      padding: 10px;
      font-size: 1.5rem;
      input {
        background: rgba(0,0,0, .2);
        color: #eee;
        padding: 10px;
        border: none;
      }
      .field {
        display: flex;
        margin: 8px 0;
        display: flex;
        .confirm {
          display: flex;
          flex: 1;
          flex-direction: row-reverse;
          .icon-btn {
            margin-right: 12px;
            color: #99a9bf;
            cursor: pointer;
            &:hover {
              color: rgba(153, 169, 191, 0.6);
            }
          }
        }
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
          object-fit: contain;
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
