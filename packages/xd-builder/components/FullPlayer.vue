<template>
<div class="xd-full-player">
  <player :device="device" :work="work" ref="player"></player>
  <button class="modal-close" @click="stopWork"></button>
</div>
</template>

<script>
import Player from '../../xd-player/Player.vue'
import { fitToContainer } from '../../danke-core/utils/common'
export default {
  components: {
    Player
  },
  props: {
    ratio: {
      type: String
    },
    work: {
      type: Object
    }
  },
  data () {
    return {
      device: null
    }
  },
  inject: ['stopWork'],
  created () {
    this.device = fitToContainer(this.ratio, window.innerWidth, window.innerHeight)
  },
  mounted () {
    this.$refs.player.play()
  }
}
</script>

<style lang="scss">
.xd-full-player {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 20001;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10,10,10,.86);
  .modal-close {
    width: 32px;
    height: 32px;
  }
}
</style>
