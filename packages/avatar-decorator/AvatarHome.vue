<template>
  <section id="avatar-home" class="section">
    <div class="container">
      <div class="raw-avatar">
      </div>
    </div>
  </section>
</template>

<script>
import RestDAO from '../utils/restdao'

export default {
  name: "AvatarHome",
  created () {
    this.workdao = new RestDAO('danke/work')
  },
  methods: {

  }
}
</script>

<style lang="scss">

</style>