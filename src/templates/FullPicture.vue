<template>
  <div class="full-picture" @click="screenClick">
    <img :src="data.src">
    <vue-anime-typing v-if="state==='on'" class="typing">{{data.text}}</vue-anime-typing>
  </div>
</template>

<script>
import templateMixins from './templateMixins'

const styleSet = {
  cover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
}

export default {
  name: 'FullPicture',
  mixins: [templateMixins],
  methods: {
    coverStyle () {
      if (this.data.style) {
        return this.data.style
      }
      if (this.data.set) {
        return styleSet[this.data.set]
      }
    }
  }
}
</script>

<style lang="less">

</style>
