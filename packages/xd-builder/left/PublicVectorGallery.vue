<template>
  <div class="left-aside-content">
    <div class="search-box">
      <el-input v-model="searchValue" placeholder="搜索素材库" class="input-with-select" clearable @clear="filterWith('')">
        <el-button slot="append" icon="el-icon-search" @click="filterWith(searchValue)"></el-button>
      </el-input>
    </div>
    <div ref="scrollContainer" class="scroll-container" @scroll="containerScroll">
      <ul ref="imageList" class="vector-list">
        <li
          v-for="(vector, index) in vectors"
          :key="index"
          class="vector-container" draggable @dragstart="dragStart(vector, $event)"
          @click="remove(vector)"
        >
          {{ index }}
          <!--          @click="$emit('choose', vector)"-->
          <img v-if="vector.url" :src="getImageUrl(vector.url, 100, 100)">
          <svg v-else-if="vector.svg" :viewBox="'0 0 ' + vector.svg.vp[2] + ' ' + vector.svg.vp[3]" width="90" height="90">
            <path v-for="(path, index) in vector.svg.ps" :key="index" :d="path.p" :fill="path.f || '#76D9FC'" />
          </svg>
          <div v-if="vector.svg || (vector.url && vector.url.endsWith('svg'))" class="is-svg">svg</div>
        </li>
      </ul>
    </div>
    <dialog-public-image ref="dialog" path="danke/public/vector" :image="currentVector" @filter="filterWith"></dialog-public-image>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import { InfiniteScroll } from 'element-ui'
import DialogPublicImage from './DialogPublicImage'
import { getImageUrl} from '../mixins/imageUtils'
import ImageDAO from '../../utils/imagedao'

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
      if (image.url) {
        await this.imagedao.removeBlob(image.url)
      }
      await this.deleteddao.create({
        uid: image.uid,
        url: image.url
      })
      await this.restdao.delete(image)
      this.vectors.splice(this.vectors.indexOf(image), 1)
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
.scroll-container {
  margin: 15px 2px 0 10px;
  overflow-y: auto;
  height: calc(100vh - 75px);
}
.vector-list {
  display: flex;
  flex-wrap: wrap;
  .vector-container {
    margin: 4px;
    width: 100px;
    height: 100px;
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
}
</style>

