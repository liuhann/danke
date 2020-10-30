<template>
  <div class="left-aside-content">
    <div class="search-box">
      <el-input v-model="searchValue" placeholder="搜索素材库" class="input-with-select" clearable @clear="filterWith('')">
        <el-button slot="append" icon="el-icon-search" @click="filterWith(searchValue)"></el-button>
      </el-input>
      <span v-if="userId === '15011245191'">
        <el-upload
          :auto-upload="false"
          action="none"
          accept="image/*"
          :show-file-list="false"
          class="upload-container"
          :on-change="(file, uploadFiles) => fileChoosed(file, uploadFiles)"
        >
          <el-button size="small" type="info" icon="el-icon-upload"></el-button>
        </el-upload>
      </span>
    </div>
    <div ref="scrollContainer" class="list-wrapper" @scroll="containerScroll">
      <ul ref="imageList" class="list-container">
        <li
          v-for="(vector, index) in vectors"
          :key="index"
          class="vector-container"
          draggable @dblclick="showVectorInfo(vector)" @dragstart="dragStart(vector, $event)"
        >
          <!--  @click="$emit('choose', vector)"-->
          <img v-if="vector.url" :src="getImageUrl(vector.url)">
        </li>
      </ul>
    </div>
    <dialog-public-image ref="dialog" path="danke/public/vector" :image="currentVector" @hide="filterWith" @filter="filterWith"></dialog-public-image>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import DialogPublicImage from './DialogPublicImage'
import { getImageUrl} from '../mixins/imageUtils'
import ImageDAO from '../../utils/imagedao'
import getImageSize from '../../utils/imageSize'

export default {
  name: 'PublicVectorGallery',
  components: {
    DialogPublicImage
  },
  mixins: [  ],
  data () {
    return {
      currentVector: {},
      searchValue: '',
      currentPage: 1,
      total: 100000000000,
      pageCount: 20,
      fetching: false,
      vectors: []
    }
  },
  computed: {
    userId()  {
      if (this.ctx.user) {
        return this.ctx.user.id
      } else {
        return ''
      }
    }
  },
  created () {
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
    this.deleteddao = new RestDAO(this.ctx, 'danke/public/deleted')
    this.imagedao = new ImageDAO(this.ctx)
  },
  mounted () {
    this.onMounted()
  },
  methods: {
    getImageUrl,
    dragStart (img, ev) {
      img.width = img.w
      img.height = img.h
      img.fit = 'contain'
      img.fill = ''
      ev.dataTransfer.setData('Text', JSON.stringify(img))
    },
    async onMounted () {
      await this.fetchMoreImages()
      while (this.$refs.imageList.offsetHeight < this.$refs.scrollContainer.offsetHeight) {
        const result = await this.fetchMoreImages()
        if (!result) {
          break
        }
      }
    },

    async fetchMoreImages () {
      if (this.vectors.length === this.total) {
        return false
      }
      if (this.fetching) {
        return false
      }
      this.fetching = true
      const query = {
        page: this.currentPage,
        count: this.pageCount
      }
      if (this.searchValue) {
        query.tags = this.searchValue
      }
      const result = await this.restdao.list(query)
      this.currentPage ++
      this.total = result.total
      this.vectors = this.vectors.concat(result.list)
      this.fetching = false
      return true
    },

    filterWith (tag) {
      this.reset(tag)
      this.$nextTick(() => {
        this.onMounted()
      })
    },

    reset (tag) {
      this.vectors = []
      this.currentPage = 1
      this.total = -1
      this.searchValue = tag
    },

    async remove (image) {
      this.vectors.splice(this.vectors.indexOf(image), 1)
      if (image.url) {
        await this.imagedao.removeBlob(image.url)
      }
      await this.deleteddao.create({
        uid: image.uid,
        url: image.url
      })
      await this.restdao.delete(image)
    },

    // may be choose multiple files, should do auto upload on choose
    // each file would trigger fileChoosed event
    async fileChoosed (file, uploadFiles) {
      const imageObject = {
        name: file.name,
        size: file.size,
      }
      let result = await this.imagedao.uploadBlob(file.raw, `public/images/${file.name}`, true)
      imageObject.url = result.name
      const size = await getImageSize(file.raw)
      imageObject.w = size.width
      imageObject.h = size.height
      // write file info
      await this.restdao.create(imageObject)

      this.filterWith()
    },

    // 处理滚动到底部的处理
    containerScroll (d) {
      if (d.target.offsetHeight + d.target.scrollTop + 100 > this.$refs.imageList.offsetHeight) {
        this.fetchMoreImages()
      }
    },

    showVectorInfo (vector) {
      this.currentVector = vector
      this.$refs.dialog.openDialog()
    }

  }
}
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
}
.vector-container {
  margin: 4px;
  width: 102px;
  height: 102px;
  background: #1b1b1b;
  position: relative;
  .is-svg {
    position: absolute;
    left: 10px;
    bottom: 10px;
    color: #fff;
    background: rgba(10, 10, 10, 0.7);
  }
  img, svg {
    margin-top: 10px;
    margin-left: 10px;
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
}
</style>

