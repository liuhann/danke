<template>
  <div class="center-text" @click="screenClick">
    <vue-anime-typing v-if="state==='on'">{{data.text}}</vue-anime-typing>
  </div>
</template>

<script>
import VueAnimeTyping from 'vue-anime-typing/src/AnimeTyping'
export default {
  name: 'CenterText',
  components: {
    VueAnimeTyping
  },
  props: {
    state: {
      type: String
    },
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  watch: {
    state (val) {

    }
  },
  methods: {
    screenClick () {
      this.engine.emit({
        index: this.index,
        name: 'click'
      })
    }
  }
}
</script>

<style lang="less">
.center-text {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
