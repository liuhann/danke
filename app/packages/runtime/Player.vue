<template>
<div class="danke-runtime">
  <div class="scene" v-for="(scene, index) in scenes" :key="index" :style="scene.style">
    <div v-for="(element, index) in scene.elements" :key="element.id" class="element-wrapper"
         @click="onElementClicked(index)"
         :style="element.style">
      {{element.content}}
    </div>
  </div>
</div>
</template>

<script>
import Danke from './danke'
import utils from '../utils/util'
export default {
  name: 'Player',
  props: {

  },
  data () {
    return {
      scenes: [],
      device: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  },
  created () {
    // assume that work is loaded from loader
    const danke = new Danke(utils.clone(this.ctx.work).scenes, this.device)
    this.scenes = danke.scenes
    this.$nextTick(() => {
      danke.next()
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
