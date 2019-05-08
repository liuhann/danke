<template>
<div id="app">
  <story-nav></story-nav>
  <story-home></story-home>
</div>
</template>

<script>
import StoryNav from './libs/NavBar.vue'
import StoryHome from './libs/StoryHome.vue'
import {Howl, Howler} from 'howler'

export default {
  name: 'view.vue',
  components: { StoryNav, StoryHome },
  data () {
    return {
      currentPlayStory: null,
      playList: []
    }
  },
  created () {
  },
  methods: {
    play (story) {
      this.howl = new Howl({
        src: ['sound.mp3']
      })
      this.howl.play()
    }
  }
}
</script>
<style lang="sass">
$body-background-color: #0B2239
</style>
