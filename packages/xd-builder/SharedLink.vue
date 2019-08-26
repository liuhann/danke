<template>
<div id="page-work-shared">
  <nav-bar/>
  <section class="section">
    <div class="container">
      <h4 class="subtitle is-4">创建新的作品</h4>

      <div class=""></div>
    </div>
  </section>
  <nav-footer></nav-footer>
</div>

</template>

<script>
import NavFooter from '../site/components/NavFooter'
export default {
  name: 'SharedLink',
  components: { NavFooter },

  data () {
    return {
      work: null
    }
  }
}
</script>

<style scoped>

</style>
