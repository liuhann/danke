<template>
  <div class="vector-album-list">
    <div class="album-list">
      <collapable-list v-if="packs.length" :column="5" :items="packs" />
    </div>
    <div class="vector-list"></div>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao'
import CollapableList from '../../common/components/CollapableList'

export default {
  name: "VectorAlbumList",
  components: { CollapableList },
  props: {
    albumTag: {
      type: String
    },
    albums: {
      type: Array
    }
  },
  data () {
    return {
      isMobile: true,
      contentType: '',
      currentPack: {},
      vectorFetching: false,
      packs: [],
      vectors: [],
      deviceWidth: 0,
      action: null,
      total: -1
    }
  },

  mounted () {
    this.onMounted()
  },

  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
  },

  methods: {
    async onMounted () {
      if (this.albumTag) {
        await this.fetchPacks()
      }
    },
    async fetchPacks () {
      const result = await this.packdao.list({
        page: 1,
        count: 40,
        tags: this.albumTag
      })
      this.packs = result.list
    }
  }
}
</script>

<style lang="scss">

</style>