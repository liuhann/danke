<template>
  <div id="player">
    <div
      v-if="work == null"
      class="loading">Loading</div>
    <player v-if="work" :work="work" :device="device"/>
  </div>
</template>

<script>
import Player from './Player'
import RestDAO from '../common/dao/restdao'
export default {
  name: 'PagePlayVue',
  components: { Player },
  data () {
    return {
      work: null,
      device: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    const mode = this.$route.params.mode
    if (mode === 'full') {
      this.device.width = window.innerWidth
      this.device.height = window.innerHeight
    }
    this.loadWork()
  },
  methods: {
    async loadWork () {
      const workId = this.$route.params.id
      this.work = await this.workdao.getOne(workId)
      // this.$nextTick(() => {
      //   this.$refs.player.play()
      // })
    }
  }
}
</script>

<style scoped>

</style>
