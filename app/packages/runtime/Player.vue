<template>
<div class="danke-runtime" :style="work.style">
  <div class="scene" v-for="(scene, index) in work.scenes" :key="index" :style="scene.style">
  </div>
</div>
</template>

<script>
import Danke from './danke'
export default {
  name: 'Player',

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
    // assume that work is loaded from loader
    const danke = new Danke(this.ctx.work, this.device)
    this.work = danke.work
    this.$nextTick(() => {
      danke.begin()
    })
  }
}
</script>

<style lang="less">
.danke-runtime {

}
</style>
