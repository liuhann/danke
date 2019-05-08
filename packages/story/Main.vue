<template>
<div>
  <story-nav @go="go" v-show="!playingOpen"></story-nav>
  <story-home v-show="currentNav === 0 && !playingOpen"></story-home>
  <playing v-if="currentPlayStory" v-show="playingOpen" :story="currentPlayStory" @return="hidePlayer"></playing>
  <playing-bar v-if="currentPlayStory" :story="currentPlayStory"></playing-bar>
</div>
</template>

<script>
import StoryNav from './libs/NavBar.vue'
import StoryHome from './libs/StoryHome.vue'
import Playing from './libs/Playing.vue'
import PlayingBar from './libs/PlayingBar.vue'

export default {
  name: 'view.vue',
  components: { StoryNav, StoryHome, Playing, PlayingBar },
  data () {
    return {
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
    }
  }
}
</script>
<style lang="sass">
$body-background-color: #0B2239
</style>
