<template>
<div id="site">
  <nav-bar></nav-bar>
  <work-list></work-list>
</div>
</template>

<script>
import NavBar from '../common/NavBar'
import WorkList from '../common/WorkList'
export default {
  name: 'view.vue',
  components: {WorkList, NavBar },
  created () {
    this.ctx.workdao
  }
}
</script>

<style lang="sass">
$body-background-color: #0B2239

@import "bulma/sass/utilities/_all.sass"
@import "bulma/sass/base/_all.sass"

@import "bulma/sass/components/navbar.sass"
@import "bulma/sass/elements/button.sass"
@import "bulma/sass/elements/image.sass"
@import "bulma/sass/grid/columns.sass"
@import "bulma/sass/components/card.sass"
@import "bulma/sass/components/media.sass"

</style>
