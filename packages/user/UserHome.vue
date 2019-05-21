<template>
<div class="user-home">
  <nav-bar></nav-bar>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child box">
          <p class="title">Three</p>
        </div>
      </div>
      <div class="tile is-8 is-vertical is-parent">
        <div class="tile is-child box">
          <p class="title">One</p>
        </div>
        <div class="tile is-child box">
          <p class="title">Two</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import NavBar from '../common/site/NavBar'
export default {
  name: 'UserHome',
  components: { NavBar }
}
</script>

<style lang="scss">

</style>
