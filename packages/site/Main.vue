<template>
<div id="site">
  <nav-bar></nav-bar>
  <work-list></work-list>
  <nav-footer></nav-footer>
</div>
</template>
<script>
import NavBar from './components/NavBar'
import WorkList from '../common/site/WorkList'
import NavFooter from './components/NavFooter'
export default {
  name: 'view.vue',
  components: { NavFooter, WorkList, NavBar },
  created () {

  }
}
</script>

<style lang="sass">
$body-background-color: #0B2239
</style>
