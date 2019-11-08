<template>
<div class="paper-folder">
  <img v-for="n in split" :key="n" :src="url" :style="getSplitRect(n-1)"/>
</div>
</template>

<script>
export default {
  name: 'PaperFolding.vue',
  props: {
    url: {
      type: String
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    split: {
      type: Number
    }
  },
  methods: {
    getSplitRect (i) {
      if (this.direction === 'horizontal') { // 水平的
        const clipPath = `clip-path: polygon(${i / this.split * 100 - 0.1}% 0, ${(i + 1) / this.split * 100}% 0, ${(i + 1) / this.split * 100}% 100%, ${i / this.split * 100 - 0.1}% 100%)`
        return clipPath
      } else {
        const clipPath = `clip-path: polygon(0 ${i / this.split * 100 - 0.1}%, 100% ${i / this.split * 100 - 0.1}%, 100% ${(i + 1) / this.split * 100}%, 0 ${(i + 1) / this.split * 100}%)`
        return clipPath
      }
    }
  }
}
</script>

<style lang="scss">
.paper-folder {
  width: 100%;
  height: 100%;
  position: relative;
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%
  }
}
</style>
