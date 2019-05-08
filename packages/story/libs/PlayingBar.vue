<template>
<div class="player-bar box" @click="showFull">
   <figure class="image is-64x64">
      <img :src="CDN_IMG + '/' + story.cover + '.png@w_240,h_240,s_2,q_100'" :alt="story.title">
    </figure>
  <div class="title-container">
    <div class="story-title">{{story.title}}</div>
    <div class="story-teller">
      <span>{{story.duration | timeFormat}}</span>
      <span v-if="story.artist">{{story.artist}}</span>
    </div>
  </div>
  <div class="pause">
    <i class="icon-pause" @click.self="pause"></i>
  </div>
</div>
</template>

<script>
import mixins from './mixins.js'
export default {
  name: 'PlayingBar.vue',
  mixins: [mixins],
  props: {
    story: {
      type: Object
    }
  },
  components: {  },
  data () {
    return {
      CDN_IMG: this.ctx.CDN_IMG
    }
  },
  created () {
  },
  methods: {
    showFull () {
      this.$emit('show-full')
    },

    pause () {
      this.$emit('pause')
    }
  }
}
</script>
<style lang="scss">
.player-bar {
  position: fixed;
  display: flex;
  bottom: 0;
  z-index: 9999;
  height: 64px;
  width: 100%;
  padding: 0;
  .cover {
    width: 64px;
  }
  .title-container {
    flex: 1;
  }
  .pause {
    line-height: 64px;
    font-size: 1.5rem;
    width: 64px;
    text-align: center;
  }
}
</style>
