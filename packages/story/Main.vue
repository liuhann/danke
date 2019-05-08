<template>
<div>
  <story-nav @go="go" v-show="!playingOpen"></story-nav>
  <story-home v-show="currentNav === 0 && !playingOpen"></story-home>
  <playing v-if="currentPlayStory" v-show="playingOpen" :story="currentPlayStory" @return="hidePlayer"></playing>
  <playing-bar v-if="currentPlayStory" :story="currentPlayStory" 
    @pause="pause" @show-full="showPlayer"></playing-bar>
</div>
</template>

<script>
import { Howl, Howler } from 'howler'
import StoryNav from './libs/NavBar.vue'
import StoryHome from './libs/StoryHome.vue'
import Playing from './libs/Playing.vue'
import PlayingBar from './libs/PlayingBar.vue'
import mixins from './libs/mixins.js'
import { setInterval } from 'timers';
export default {
  name: 'Main.vue',
  mixins: [ mixins ],
  components: { StoryNav, StoryHome, Playing, PlayingBar },
  data () {
    return {
      isPlaying: false,
      progress: 0,
      playingOpen: false,
      currentNav: 0,
      currentPlayStory: null,
      playList: []
    }
  },
  created () {
    this.ctx.playStory = this.play
  },
  methods: {
    go (n) {
      this.currentNav = n
    },
    hidePlayer () {
      this.playingOpen = false
    },
    showPlayer () {
      this.playingOpen = true
    },

    pause () {
      
    },

    resume () {

    },
    play (story) {
      const _this = this
      this.currentPlayStory = story
      this.playingOpen = true
      if (this.ctx.howl) {
        this.ctx.howl.unload()
      }
      if (this.inteval) {
        clearInterval(this.inteval)
      }

      this.ctx.howl = new Howl({
        src: [`${this.CDN_STORY}/${encodeURIComponent(story.path)}`],
        html5: true,
        format: ['mp3']
      });
      this.ctx.howl.play();

      this.inteval = setInterval(() => {
        debugger
        if (_this.ctx.howl) {
          _this.isPlaying = _this.ctx.howl.isPlaying
        }
      }, 1000)
    }
  }
}
</script>
<style lang="scss">
</style>
