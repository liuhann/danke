<template>
  <div class="left-aside-content">
    <div class="search-box">
      <el-input v-model="searchValue" placeholder="搜索素材库" class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div ref="scrollContainer" class="scroll-container" @scroll="containerScroll">
      <ul ref="imageList" class="image-list">
        <li
          v-for="(image, index) in images"
          :key="index"
          class="image-container" draggable @dragstart="dragStart(image, $event)"
        >
          <img :src="getImageUrl(image.url, 100, 100)">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import { InfiniteScroll } from 'element-ui'
import { getImageUrl} from '../mixins/imageUtils'

export default {
  name: 'VectorList',
  directives: {
    [InfiniteScroll.name]: InfiniteScroll
  },
  mixins: [  ],
  data () {
    return {
      searchValue: '',
      currentPage: 1,
      total: 100000000000,
      pageCount: 20,
      fetching: false,
      images: [],
    }
  },
  created () {
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
  },
  mounted () {
    this.onMounted()
  },
  methods: {
    getImageUrl,
    dragStart (img, ev) {
      img.width = img.w
      img.height = img.h
      ev.dataTransfer.setData('Text', JSON.stringify(img))
    },

    async onMounted () {
      await this.fetchMoreImages()
      while (this.$refs.imageList.offsetHeight < this.$refs.scrollContainer.offsetHeight) {
        await this.fetchMoreImages()
      }
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
      this.currentPage ++
      this.total = result.total
      this.images = this.images.concat(result.list)
      this.fetching = false
    },
    containerScroll (d) {
      if (d.target.offsetHeight + d.target.scrollTop + 100 > this.$refs.imageList.offsetHeight) {
        this.fetchMoreImages()
      }
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
    margin: 4px;
    width: 100px;
    height: 100px;
    background: rgba(0,0,0, .8);
    img {
      margin-top: 10px;
      margin-left: 10px;
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
  }
}
</style>
