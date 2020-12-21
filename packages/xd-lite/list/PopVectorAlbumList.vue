<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '60%'}">
    <van-grid clickable square :icon-size="42">
      <van-grid-item v-for="(pack, index) in packs" :key="index" :icon="getImageUrl(pack.previews[0]) || 'image-o'"
                     :text="pack.name" @click="$emit('input', pack)"
      />
    </van-grid>
  </van-popup>
</template>

<script>
import RestDAO from '../../utils/restdao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'

export default {
  name: "PopVectorAlbumList",
  data () {
    return {
      show: false,
      packs: [],
      currentPage: 1,
      total: 100000000000,
      pageCount: 36
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
  },
  mounted () { },
  methods: {
    open(channel) {
      this.show = true
      this.fetchPacks(channel)
    },
    close () {
      this.show = false
    },
    getImageUrl,
    async fetchPacks (channel) {
      const result = await this.packdao.list({
        page: this.currentPage,
        count: this.pageCount,
        tags: channel
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
