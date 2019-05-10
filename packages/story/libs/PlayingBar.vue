<template>
<div class="player-bar" @click="showFull">
   <figure class="image is-48x48">
      <img class="is-rounded" :src="CDN_IMG + '/' + story.cover + '.png@w_240,h_240,s_2,q_100'" :alt="story.title">
    </figure>
  <div class="title-container">
    <div class="story-title">{{story.title}}</div>
    <div class="story-teller">
      <span class="artist" v-if="story.artist">{{story.artist}}</span>
      <span class="tell-progress">{{progress | timeFormat}}/{{story.duration | timeFormat}}</span>
    </div>
  </div>
  <div class="pause">
    <i v-if="isPlaying" class="icon-pause-outline" @click.stop="pause"></i>
    <i v-if="!isPlaying" class="icon-play-outline" @click.stop="resume"></i>
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
    },
    progress: {
      type: Number
    },
    isPlaying: {
      type: Boolean,
      default: false
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
    },

    resume () {
      this.$emit('resume')
    }

  }
}
</script>
<style lang="scss">
.player-bar {
  border-top: 1px solid #ccc;
  background: #fff;
  position: fixed;
  display: flex;
  bottom: 0;
  z-index: 9999;
  height: 64px;
  width: 100%;
  padding: 0;
  figure {
    margin-top: 8px;
    margin-left: 8px;
  }
  .cover {
    width: 64px;
  }
  .title-container {
    flex: 1;
    .story-title {
      color: #2E2E2E;
      padding: 0 10px;
      font-size: 18px;
      line-height: 34px;
      height: 34px;
      white-space:nowrap;
      text-overflow: ellipsis;
    }
    .story-teller {
      color: #7B7B7B;
      font-size: 14px;
      line-height: 20px;
      padding: 0 10px;
      .tell-progress {
        float: right;
      }
    }
  }
  .pause {
    color: #FF6735;
    line-height: 64px;
    font-size: 1.5rem;
    width: 64px;
    text-align: center;
  }
}
</style>
