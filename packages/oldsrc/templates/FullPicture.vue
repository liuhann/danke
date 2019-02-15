<template>
  <div class="full-picture" @click="screenClick" ref="container">
    <div class="picture">
      <img :src="data.src">
    </div>
    <div class="text-explain">
      <vue-anime-typing v-if="state==='on'" class="typing">{{data.text}}</vue-anime-typing>
    </div>
  </div>
</template>

<script>
import templateMixins from './SceneMixins'

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

  mounted () {
    console.log(this.$refs.container)
  },

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
