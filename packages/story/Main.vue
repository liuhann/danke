<template>
<div id="app">
  <story-nav></story-nav>
  
</div>
</template>

<script>
import StoryNav from './libs/NavBar.vue'
export default {
  name: 'view.vue',
  components: { StoryNav },
  created () {
    this.ctx.workdao
  }
}
</script>
<style lang="sass">
$body-background-color: #0B2239
</style>
