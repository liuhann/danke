<template>
<div class="page-ticked" @click="pageTickClick">
  <div v-for="scene in work.scenes" :key="scene.id"
       :style="scene.style" class="scene">
    <div v-for="(element) in scene.elements" :key="element.id"
         :class="['type' + element.type]"
         :style="element.style" class="element">
      <img v-if="element.url" :src="element.url" :style="element.innerStyle||''">
    </div>
  </div>
</div>
</template>

<script>
import TickEngine from './tick-engine.js'
export default {
  name: 'TickedPreview',
  data () {
    return {
      started: false,
      device: {
        width: window.screen.availWidth,
        height: window.screen.availHeight
      },
      work: this.ctx.work
    }
  },
  created () {

  },
  methods: {
    play () {
      this.engine = new TickEngine(this.work, this.device)
      this.engine.play()
    },
    pageTickClick () {
      if (this.started) {
        this.engine.next()
      } else {
        this.play()
      }
    }
  }
}
</script>

<style lang="scss">

</style>
