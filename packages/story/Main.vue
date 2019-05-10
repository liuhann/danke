<template>
<div class="story-main">
  <story-nav @go="go" v-show="!playingOpen"></story-nav>
  <story-home v-show="currentNav === 0 && !playingOpen"></story-home>
  <playing v-if="currentPlayStory" class="animate-out" v-show="playingOpen" :story="currentPlayStory" @return="hidePlayer"
    :progress="progress" :is-playing="isPlaying" @pause="pause" @resume="resume" ></playing>
  <playing-bar v-if="currentPlayStory" v-show="!playingOpen" :story="currentPlayStory" :progress="progress" :is-playing="isPlaying"
    @pause="pause" @resume="resume" @show-full="showPlayer"></playing-bar>
</div>
</template>

<script>
import './fontello/css/fontello.css'
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
      if (this.ctx.howl) {
        this.ctx.howl.pause()
      }
      this.isPlaying = false
      if (this.inteval) {
        clearInterval(this.inteval)
      }
    },

    resume () {
      if (this.ctx.howl) {
        this.ctx.howl.resume()
      }
      this.isPlaying = true
      this.startTick()
    },

    startTick () {
      const _this = this
      if (this.inteval) {
        clearInterval(this.inteval)
      }
      this.inteval = setInterval(() => {
        if (_this.ctx.howl) {
          _this.isPlaying = _this.ctx.howl.playing()
          _this.progress = _this.ctx.howl.seek()
        }
      }, 1000)
    },
    play (story) {
      const _this = this
      this.currentPlayStory = story
      this.playingOpen = true
      if (this.ctx.howl) {
        this.ctx.howl.unload()
      }
      this.ctx.howl = new Howl({
        src: [`${this.CDN_STORY}/${encodeURIComponent(story.path)}`],
        html5: true,
        autoplay: true,
        format: ['mp3']
      });
      this.startTick()
    }
  }
}
</script>
<style lang="scss">
html {
  background: linear-gradient(to right, #FD8735, #FF6735);
  background-size: 100% 100%;
}
</style>
