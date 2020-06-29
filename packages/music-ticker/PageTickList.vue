<template>
  <div id="tick-list">
  </div>
</template>

<script>
import antVueMixin from '../utils/ant-vue-mixins'
import RestDAO from '../utils/restdao.js'
export default {
  mixins: [antVueMixin],
  data () {
    return {

    }
  },
  created () {
    this.audiodao = new RestDAO(this.ctx, 'danke/audio')
  },
  mounted () {

  },
  methods: {
    async loadAudios () {
      this.audiodao.list
    }
  }
}
</script>

<style>

</style>