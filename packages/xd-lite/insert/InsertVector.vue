<template>
  <div>
    <van-button v-if="!showPackList" plain hairline type="info" icon="return" @click="closePack">返回列表</van-button>
    <van-grid v-show="showPackList" clickable square :icon-size="32">
      <van-grid-item v-for="(pack, index) in packs" :key="index" :icon="getImageUrl(pack.previews[0]) || 'image-o'"
                     :text="pack.name" @click="openPack(pack)"
      />
    </van-grid>
    <van-grid v-show="!showPackList" clickable square :icon-size="48">
      <van-grid-item v-for="(vector, index) in vectors" :key="index" :icon="getImageUrl(vector.url)" @click="chooseVector(vector)">
        <div v-if="vector.html" class="svg-container" :style="getVariableStyle(vector.variables)">
          <div class="styled-box" v-html="vector.html">
          </div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao'
import ImageDAO from '../../utils/imagedao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
import { getVariableStyle } from '../../xd-builder/mixins/renderUtils'

export default {
  name: 'InsertVector',
  props: {
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      showDialog: false,
      packs: [],
      currentPage: 1,
      total: 100000000000,
      pageCount: 36,
      currentVector: {},
      fetching: false,
      showPackList: true,
      vectors: []
    }
  },
  watch: {
    show () {
      this.showDialog = this.show
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
    this.deleteddao = new RestDAO(this.ctx, 'danke/public/deleted')
    this.imagedao = new ImageDAO(this.ctx)
  },
  mounted () {
    this.onMounted()
  },
  methods: {
    getImageUrl,
    getVariableStyle,
    chooseVector (vector) {
      this.closeDialog()
      this.$emit('insert', 'vector', vector)
    },
    closeDialog () {
      this.closePack()
      this.$emit('close')
    },

    async openPack (pack) {
      this.showPackList = false
      const query = {
        page: this.currentPage,
        pack: pack._id,
        count: 500
      }
      const result = await this.restdao.list(query)
      this.vectors = result.list
    },

    async closePack () {
      this.showPackList = true
      this.vectors = []
    },

    async fetchPacks () {
      const result = await this.packdao.list({
        page: this.currentPage,
        count: this.pageCount
      })
      this.packs = result.list
      this.total = result.total
    },
    async onMounted () {
      await this.fetchPacks()
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