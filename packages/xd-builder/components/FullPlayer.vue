<template>
<div class="xd-full-player">
  <player :device="device" :work="work"></player>
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
  created () {
    this.device = fitToContainer(this.ratio, window.innerWidth, window.innerHeight)
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
  justify-content: center;
  background: rgba(0,0,0, .8);
}
</style>
