<template>
<div id="player">
  <div class="loading" v-if="work == null">Loading</div>
  <player ref="player" v-if="work" :work="work" :device="device"></player>
</div>
</template>

<script>
import Player from './Player'
import RestDAO from '../common/dao/restdao'
import { fitToContainer } from '../danke-core/utils/common'
export default {
  name: 'PagePlay.vue',
  components: { Player },
  data () {
    return {
      work: null,
      device: {
        width: 1024,
        height: 768
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    const mode = this.$route.params.mode
    this.loadWork()
  },
  methods: {
    async loadWork () {
      const workId = this.$route.params.id
      this.work = await this.workdao.getOne(workId)
      this.$nextTick(() => {
        this.$refs.player.play()
      })
    }
  }
}
</script>

<style scoped>

</style>
