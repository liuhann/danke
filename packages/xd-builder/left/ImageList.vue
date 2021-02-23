<template>
  <div id="my-uploaded-images" class="left-aside-content">
    <div v-if="!currentAlbum" class="album-list">
      <div v-for="album in albums" :key="album._id" class="album">
        <div class="album-title">
          <div class="text">
            {{ album.name }}
          </div>
          <div class="more" @click="openAlbum(album)">
            打开
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
              :on-change="(file, uploadFiles) => fileChoosed(file, uploadFiles, album)"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </div>
          <div
            v-for="(image, index) in album.covers" :key="index"
            class="item image" draggable @dragstart="dragStart(image, $event)"
            @click="imageClicked(image)"
          >
            <img :src="getImageUrl(image.url)">
          </div>
        </div>
      </div>
      <div class="album">
        <div class="album-title">
          <div v-show="!showNewAlbumName" class="more" @click="showNewAlbumName = true">
            +新增图库
          </div>
          <div v-show="showNewAlbumName" class="input">
            <el-input v-model="newAlbumName" size="mini" />
          </div>
          <div v-show="showNewAlbumName" class="confirm" @click="confirmAddNewAlbum">
            <i class="el-icon-check" />
          </div>
          <div v-show="showNewAlbumName" class="confirm" @click="showNewAlbumName = false">
            <i class="el-icon-close" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentAlbum" class="album-opened album">
      <div v-if="!albumEditing" class="album-title">
        <div class="more" @click="closeAlbum">
          <i class="el-icon-arrow-left" />
        </div>
        <div class="text">
          {{ currentAlbum.name }} <span v-if="currentAlbum.mask" class="tag">mask</span> <span v-if="currentAlbum.shared" class="tag">shared</span>
        </div>
        <div class="edit" @click="editAlbum">
          <i class="el-icon-edit" />
        </div>
        <div class="trash" @click="removeAlbum">
          <i class="el-icon-delete" />
        </div>
      </div>
      <div v-if="albumEditing" class="album-editing">
        <div class="input">
          <el-input v-model="currentAlbum.name" size="mini" />
        </div>
        <div class="field">
          <el-checkbox v-model="currentAlbum.shared">
            分享
          </el-checkbox>
          <div class="confirm">
            <div class="icon-btn" @click="confirmAlbumEditing">
              <i class="el-icon-check" />
            </div>
            <div class="icon-btn" @click="albumEditing = false">
              <i class="el-icon-close" />
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
            :on-change="(file, uploadFiles) => fileChoosed(file, uploadFiles, currentAlbum)"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </div>
        <div
          v-for="(image, index) in albumImages" :key="index"
          class="item image" draggable @dragstart="dragStart(image, $event)"
          @dblclick="imageDblClicked(image)"
          @click="imageClicked(image)"
        >
          <img :src="getImageUrl(image.url)" :style="imageSizeStye(image)">
          <span v-if="image.width" class="image-size">{{ image.width }}X{{ image.height }}</span>
          <i class="el-icon-delete" @click="removeImage(image)" />
        </div>
      </div>
      <el-pagination background :total="total" :page-size="pageSize" :current-page.sync="page" layout="prev, pager, next" @current-change="loadAlbumImages" />
    </div>
    <el-dialog
      title="图片编辑"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form size="mini">
        <el-form-item label="宽度">
          <el-input-number v-model="currentImage.width" size="mini" controls-position="right" />
        </el-form-item>
        <el-form-item label="高度">
          <el-input-number v-model="currentImage.height" size="mini" controls-position="right" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="currentImage.tags"
            multiple
            filterable
            allow-create
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImageEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import ImageDAO from '../../utils/imagedao'
import { Upload, Button, Pagination, Checkbox, Input, Popconfirm, Message } from 'element-ui'
import { fitRectIntoBounds } from '../mixins/rectUtils.js'
import getImageSize from '../../utils/imageSize.js'
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
      dialogVisible: false,
      albums: [],
      IMG_SERVER: this.ctx.IMG_SERVER,
      showNewAlbumName: false,
      currentImage: {},
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
      this.albumImages = []
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

    async readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsText(file, "UTF-8")
      })
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

      const imageObject = {
        name: file.name,
        size: file.size,
        album: album._id,
      }

      // 尝试对于颜色<=2的图片进行转换
      // 暂时去掉inline-SVG的支持
      if (false && file.name.endsWith('.svg')) {
        const fileContent = await this.readFileAsync(file.raw)
        const replaced = this.replaceFillColorWithVariables(fileContent)
        if (replaced.variables.length === 1) {
          // 保存svg正文直接到图片，不使用阿里云
          imageObject.content = replaced.content
          imageObject.variables = replaced.variables
        } else {
          // 颜色太多就直接存正文到aliyun 和png同样处理 （宽度和高度不做调整）
          let result = await this.imagedao.uploadBlob(file.raw, `images`)
          imageObject.url = result.name
        }
      } else {
        let result = await this.imagedao.uploadBlob(file.raw, `images`)
        imageObject.url = result.name
        Object.assign(imageObject, await getImageSize(file.raw))
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
    /**
     * 获取及替换颜色操作
     */
    replaceFillColorWithVariables (svg) {
      let content = svg
      let rgbRegex = /[rR][gG][Bb][Aa]?[\\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\\.\\d{1,2}|1|0)?[\\)]{1}/g
      let colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|rgb[a]?\([^)]+\)/g
      const colorMatched = svg.match(colorRegex);
      const colorList = Array.from(new Set(colorMatched))
      const variables = []
      for (let i = 0; i < colorList.length; i++) {
        variables.push({
          'name': 'fillColor' + i,
          'value': colorList[i],
          'label': '颜色' + i,
          'type': 'color'
        })
        content = content.replace(new RegExp(colorList[i].replace('(', '\\(').replace(')', '\\)'), 'gm'), `var(--fillColor${i})`)
      }
      content = content.replace(/<g>\s+<\/g>/g, '')
      if (variables.length === 0) {
        variables.push({
          'name': 'globalFill',
          'value': '#555',
          'label': '整体颜色',
          'type': 'color'
        })
        content = content.replace(/<svg/, '<svg fill="var(--globalFill)"')
      }
      return {
        content,
        variables
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
      // 删除阿里云存储的图片
      await this.imagedao.removeBlob(image.url)
      // 删除rest记录
      await this.restdao.delete(image)
      this.updateAlbumCover(this.currentAlbum)
      this.loadAlbumImages()
    },

    dragStart (image, ev) {
      // stringify image info as text
      ev.dataTransfer.setData('Text', JSON.stringify(image))
      this.draggingImage = true
    },

    imageDblClicked (image) {
      this.dialogVisible = true
      this.currentImage = image
    },

    imageClicked (image) {
      this.$emit('choose', image)
    },

    imageSizeStye (image) {
      if (image.width && image.height) {
        const fitted = fitRectIntoBounds(image, {
          width: 70,
          height: 70
        })
        return {
          width: fitted.width + 'px',
          height: fitted.height + 'px'
        }
      } else {
        return {}
      }
    },

    async confirmImageEdit () {
      // write file info
      await this.restdao.patch(this.currentImage._id, {
        width: this.currentImage.width,
        height: this.currentImage.height,
        tags: this.currentImage.tags
      })
      this.dialogVisible = false
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
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 70px;
          height: 70px;
          object-fit: fill;
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
        .image-size {
          position: absolute;
          bottom: 2px;
          left: 2px;
          display: none;
          font-size: 10px;
          color: #fff;
          transform: scale(.8);
          background-color: rgba(0,0,0, .7);
        }
        &:hover {
          .el-icon-delete {
            display: initial;
          }
          .image-size {
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
