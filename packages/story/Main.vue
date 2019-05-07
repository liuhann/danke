<template>
<div id="app">
  <story-nav></story-nav>
  <story-home></story-home>
</div>
</template>

<script>
import StoryNav from './libs/NavBar.vue'
import StoryHome from './libs/StoryHome.vue'
export default {
  name: 'view.vue',
  components: { StoryNav, StoryHome },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    
  }
}
</script>
<style lang="sass">
$body-background-color: #0B2239
</style>
