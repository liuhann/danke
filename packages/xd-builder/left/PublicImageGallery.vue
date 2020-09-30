<template>
  <div class="left-aside-content">
    <div class="search-box">
      <el-input v-model="searchValue" class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="scroll-container" @scroll="containerScroll">
      <ul ref="imageList" class="image-list">
        <li
          v-for="(image, index) in images"
          :key="index"
          class="image-container"
          draggable
          @click="remove(image)"
          @dragstart="dragStart(image, $event)"
        >
          <!--          @dblclick="showImageInfo(image)" -->
          <img :src="getImageUrl(image.url, 160, 160)">
        </li>
      </ul>
    </div>
    <dialog-public-image ref="dialog" resturl="danke/public/image" :image="currentImage" @delete="confirmDeleteImage"></dialog-public-image>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import { InfiniteScroll } from 'element-ui'
import { getImageUrl} from '../mixins/imageUtils'
import DialogPublicImage from './DialogPublicImage'
import ImageDAO from '../../utils/imagedao'
export default {
  name: 'PublicImageGallery',
  directives: {
    [InfiniteScroll.name]: InfiniteScroll
  },
  components: {
    DialogPublicImage
  },
  mixins: [  ],
  data () {
    return {
      currentImage: {},
      searchValue: '',
      currentPage: 1,
      total: 100000000000,
      pageCount: 20,
      fetching: false,
      images: [],
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.restdao = new RestDAO(this.ctx, 'danke/public/image')
    this.deleteddao = new RestDAO(this.ctx, 'danke/public/deleted')
    this.vectordao = new RestDAO(this.ctx, 'danke/public/vector')
  },
  mounted () {
    this.fetchMoreImages()
  },
  methods: {
    async doWork () {},
    getImageUrl,
    showImageInfo (img) {
      this.currentImage = img
      this.$refs.dialog.openDialog()
    },
    async move (img) {
      await this.restdao.delete(img)
      delete img._id
      img.type = 'vct'
      await this.vectordao.create(img)
    },
    dragStart (img, ev) {
      img.width = img.w
      img.height = img.h
      ev.dataTransfer.setData('Text', JSON.stringify(img))
    },
    async fetchMoreImages () {
      if (this.images.length === this.total) {
        return
      }
      if (this.fetching) {
        return
      }

      this.fetching = true
      const result = await this.restdao.list({
        page: this.currentPage,
        count: this.pageCount
      })
      //自动移动吧
      // for (let image of result.list) {
      //   await this.move(image)
      // }
      this.currentPage ++
      this.total = result.total
      this.images = this.images.concat(result.list)
      this.fetching = false
    },
    containerScroll (d) {
      if (d.target.offsetHeight + d.target.scrollTop + 100 > this.$refs.imageList.offsetHeight) {
        this.fetchMoreImages()
      }
    },

    async remove (image) {
      this.images.splice(this.images.indexOf(image), 1)
      if (image.url) {
        await this.imagedao.removeBlob(image.url)
      }
      await this.deleteddao.create({
        uid: image.uid,
        url: image.url
      })
      await this.restdao.delete(image)
    },

    confirmDeleteImage (img) {
      this.images.splice(this.images.indexOf(img), 1)
    }

  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  margin: 15px 2px 0 10px;
  overflow-y: auto;
  height: calc(100vh - 75px);
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  .image-container {
    margin: 3px;
    width: 160px;
    height: 160px;
    background: rgba(0,0,0, .8);
    img {
      width: 160px;
      height: 160px;
      object-fit: contain;
    }
  }
}
</style>
