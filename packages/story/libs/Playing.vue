<template>
<div class="player">
  <div class="cover-container">
    <figure class="image is-240x240">
      <img class="is-rounded" :class="isPlaying? 'rotating': ''" :src="CDN_IMG + '/' + story.cover + '.png@w_240,h_240,s_2,q_100'" :alt="story.title">
    </figure>
    <i class="icon-left-outline" @click="returnHome"></i>
  </div>
  <div class="ctrl">
    <i v-if="isPlaying" class="btn-ctrl icon-pause-outline" @click.stop="pause"></i>
    <i v-if="!isPlaying" class="btn-ctrl icon-play-outline" @click.stop="resume"></i>
    <span class="tell-progress">{{progress | timeFormat}}/{{story.duration | timeFormat}}</span>
  </div>

  <div class="body">
    <p class="story-name">
      {{story.title}}
    </p>
    <div class="teller">
      <a class="name" v-if="story.artist">
        {{story.artist}}
      </a>
      <a class="duration">
        时长: {{story.duration | timeFormat}}
      </a>
    </div>
    <div class="shares">
      <i class="icon-heart-1"></i>
      <i class="icon-download-outline"></i>
      <i class="icon-bookmark"></i>
    </div>
    <h2 class="subtitle"><i class="icon-thumbs-up" style="color: #41C4FF;"></i> 故事推荐</h2>
    <div class="related" v-if="teller">
       <story-grids :stories="teller.list"></story-grids>
    </div>
    <div class="related" v-if="album">
       <story-grids :stories="album.list"></story-grids>
    </div>
  </div>
</div>
</template>

<script>
import './slider.scss'
import { setInterval } from 'timers'
import mixins from './mixins.js'
import StoryGrids from './StoryGrids.vue'
export default {
  name: 'Playing.vue',
  mixins: [ mixins ],
  components: {
    StoryGrids
  },
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
  data () {
    return {
      teller: {},
      album: {}
    }
  },
  watch: {
    story () {
      this.getRelatedStories()
    }
  },
  created () {
    this.getRelatedStories()
  },
  methods: {
    async getRelatedStories () {
      if (this.story) {
        const result = await this.ctx.storydao.getStoryRelated(this.story)
        this.teller = result.teller
        this.album = result.album
      }
    },
    pause () {
      this.$emit('pause')
    },
    resume () {
      this.$emit('resume')
    },
    returnHome () {
      this.$emit('return')
    }
  }
}
</script>
<style lang="scss">

.rotating {

}

.cover-container {
  width: 100vw;
  height: 100vw;
  position: relative;
  .icon-left-outline {
    position: absolute;
    left: .8rem;
    top: .8rem;
    font-size: 1.5rem;
    color: #fff;
  }
  .image {
    img {
      box-shadow:0px 0px 0px 14px rgba(0,0,0,.3);
    }
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -120px;
    margin-top: -120px;
  }
}
.player {
  margin-top: -3.5rem;
  .ctrl {
    margin-top: -2rem;
    padding: .5rem 1rem;
    padding-left: 50%;
    margin-left: -2rem;
    font-size: 2rem;
    color: #fff;
    height: 4rem;
    .tell-progress {
      font-size: 1rem;
      float: right;
      line-height: 4rem;
    }
  }
  .body {
    background-color: #fff;
    color: #383838;
    .story-name {
      font-size: 1.25rem;
      padding: .5rem 1rem;
    }
    .teller {
      font-size: 1.25rem;
      padding: 0 1rem;
    }
    .shares {
      padding: 0 1rem;
      font-size: 1.5rem;
      line-height: 3.5rem;
      display: flex;
      height: 3.5rem;
      color: #7B7B7B;
      border-bottom: 1px solid #ccc;
      margin-bottom: 2rem;
      >i {
        text-align: center;
        flex: 1;
      }
    }
  }
}
</style>
