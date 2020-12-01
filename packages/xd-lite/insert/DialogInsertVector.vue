<template>
  <el-dialog :visible.sync="show" title="插入矢量图片" fullscreen>
    <div class="columns is-mobile is-multiline is-1">
      <div v-for="(vector, index) in vectors" :key="index"
           class="column is-one-quarter"
      >
        <figure class="image is-square">
          <img v-if="vector.url" :src="getImageUrl(vector.url)">
        </figure>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import RestDAO from '../../utils/restdao'
import ImageDAO from '../../utils/imagedao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'

export default {
  name: 'DialogInsertVector',
  props: {
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      currentVector: {},
      currentPage: 1,
      total: 100000000000,
      pageCount: 36,
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
    async onMounted () {
      await this.fetchMoreImages()
    },
    async fetchMoreImages () {
      if (this.fetching) {
        return false
      }
      this.fetching = true
      const query = {
        page: this.currentPage,
        count: this.pageCount
      }
      const result = await this.restdao.list(query)
      this.currentPage ++
      this.total = result.total
      this.vectors = result.list
      this.fetching = false
      return true
    }
  }
}
</script>

<style scoped>

</style>