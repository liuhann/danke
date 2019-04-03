<template>
<div id="app">
  <nav-bar v-if="!mobileDesigner"></nav-bar>
  <router-view></router-view>
</div>
</template>

<script>
import NavBar from '../packages/common/NavBar'
export default {
  name: 'view.vue',
  components: { NavBar },
  data () {
    return {
      isMobile: window.innerWidth < window.innerHeight ? true : false
    }
  },
  computed: {
    mobileDesigner () {
      return this.isMobile && this.$route.path.indexOf('/designer') > -1
    }
  }
}
</script>

<style>

</style>
