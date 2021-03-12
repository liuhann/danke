<template>
  <el-dialog :visible.sync="showDialog" title="输入文字内容" fullscreen @close="closeDialog">
    <el-button slot="title" type="success" @click="confirmText">确定</el-button>
  </el-dialog>
</template>

<script>

export default {
  name: 'DialogInsertText',
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
      this.$emit('insert', vector)
    },
    closeDialog () {
      this.showDialog = false
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