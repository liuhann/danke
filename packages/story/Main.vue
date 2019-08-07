<template>
<div class="story-main">
  <story-nav @go="go" @search="isSearching = true" v-show="!playingOpen && !isSearching"></story-nav>
  <story-home v-show="currentNav === 0 && !playingOpen && !isSearching"></story-home>
  <story-search v-if="isSearching" @close="closeSearch"></story-search>
  <album-discover v-if="currentNav === 1 && !playingOpen && !isSearching"></album-discover>
  <user-home v-if="currentNav === 2 && !playingOpen && !isSearching"></user-home>
  <transition name="bounce">
  <playing v-if="currentPlayStory && playingOpen" :story="currentPlayStory"  @return="hidePlayer"
    :progress="progress" :is-playing="isPlaying" @pause="pause" @resume="resume" ></playing>
  </transition>
  <playing-bar v-if="currentPlayStory" v-show="!playingOpen" :story="currentPlayStory" :progress="progress" :is-playing="isPlaying"
    @pause="pause" @resume="resume" @show-full="showPlayer"></playing-bar>
</div>
</template>

<script>
import './fontello/css/fontello.css'
import LocalDAO from './libs/localdao.js'
import { Howl, Howler } from 'howler'
import StoryNav from './libs/NavBar.vue'
import StoryHome from './libs/StoryHome.vue'
import Playing from './libs/Playing.vue'
import PlayingBar from './libs/PlayingBar.vue'
import mixins from './libs/mixins.js'
import StorySearch from './libs/StorySearch.vue'
import AlbumDiscover from './libs/AlbumDiscover.vue'
import UserHome from './libs/UserHome.vue'
export default {
  name: 'Main.vue',
  mixins: [ mixins ],
  components: { StoryNav, StoryHome, Playing, PlayingBar, StorySearch, AlbumDiscover, UserHome },
  data () {
    return {
      isPlaying: false,
      isSearching: false,
      progress: 0,
      playingOpen: false,
      currentNav: 0,
      currentPlayStory: null,
      playList: []
    }
  },
  created () {
    this.ctx.playStory = this.play
    this.ctx.localdao = new LocalDAO()
  },
  methods: {
    go (n) {
      this.currentNav = n
    },
    closeSearch () {
      this.isSearching = false
    },
    hidePlayer () {
      this.playingOpen = false
    },
    showPlayer () {
      window.scrollTo(0, 0)
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
      window.scrollTo(0, 0)
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
      this.ctx.localdao.addPlayHistory(story)
    }
  }
}
</script>
<style lang="scss">
html, body {
  background: linear-gradient(to right, #FD8735, #FF6735);
  background-size: 100% 100%;
  overflow-x: hidden;
}
.bounce-enter-active {
  animation: bounce-in .4s;
}
.bounce-leave-active {
  animation: bounce-in .4s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateY(700px);
  }
  100% {
    transform: translateY(0);
  }
}

</style>
