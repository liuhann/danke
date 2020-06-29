<template>
  <div id="player">
    <div v-if="!work" class="loading boxLoading">
    </div>
    <player v-if="work" :work="work" :device-set="device"/>
  </div>
</template>

<script>
import Player from './Player'
import RestDAO from '../utils/restdao.js'
import { fitBy } from '../danke-core/utils/common'
export default {
  name: 'PagePlayVue',
  components: { Player },
  data () {
    return {
      work: null,
      device: {
        width: 300,
        height: 300
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.loadWork()
  },
  methods: {
    async loadWork () {
      const workId = this.$route.params.id
      this.work = await this.workdao.getOne(workId)
      this.device = fitBy(this.work.ratio, window.innerWidth, window.innerHeight)
    }

  }
}
</script>

<style>
#player {
  background-color: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
