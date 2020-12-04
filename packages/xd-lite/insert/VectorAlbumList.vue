<template>
  <div>
    <van-grid clickable square :icon-size="32">
      <van-grid-item v-for="(pack, index) in packs" :key="index" :icon="getImageUrl(pack.previews[0]) || 'image-o'"
                     :text="pack.name" @click="$emit('open', pack)"
      />
    </van-grid>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'

export default {
  name: "VectorAlbumList",
  data () {
    return {
      packs: [],
      currentPage: 1,
      total: 100000000000,
      pageCount: 36
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
  },
  mounted () {
    this.onMounted()
  },
  methods: {
    getImageUrl,
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
  }
}
</script>

<style scoped>

</style>