<template>
<div id="pack-detail">
  <div class="pack-meta">
    <div class="title">

    </div>
  </div>
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'

export default {
  name: 'PackDetail',
  data () {
    return {
      pack: null,
      list: []
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.elementdao  = new RestDAO(this.ctx, 'danke/')
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    async fetchData () {
      this.pack = await this.packdao.getOne(this.$route.params.pack)

    }
  }
}
</script>

<style scoped>

</style>