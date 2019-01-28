<template>
<div class="danke-runtime" :style="work.style">
  <div class="scene" v-for="(scene, index) in work.scenes" :key="index" :style="scene.style">
    <div v-for="(element, index) in scene.elements" :key="element.id" class="element-wrapper"
         @click="onElementClicked(index)"
         :style="element.style">
    </div>
  </div>
</div>
</template>

<script>
import Danke from './danke'
export default {
  name: 'Player',
  props: {

  },
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
  },
  methods: {
    onElementClicked () {

    }
  }
}
</script>

<style lang="less">
.danke-runtime, .scene {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

}
</style>
