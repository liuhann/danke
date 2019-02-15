<template>
  <div class="center-text" @click="screenClick">
    <vue-anime-typing v-if="state==='on'">{{data.text}}</vue-anime-typing>
  </div>
</template>

<script>
import templateMixins from './SceneMixins'
export default {
  name: 'CenterText',
  mixins: [templateMixins],
  watch: {
    state (val) {

    }
  },
  methods: {
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
