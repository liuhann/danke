<template>
<div id="page-work-shared">
  <nav-bar/>
  <section class="hero is-medium">
    <div class="hero-body" v-if="work">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h4 class="subtitle is-4">{{work.title}}</h4>
          </div>
          <div class="column preview">
            <work-cover v-if="work" :work="work"></work-cover>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <h4 class="subtitle is-4">作品概览</h4>

    </div>
  </section>
  <nav-footer></nav-footer>
</div>

</template>

<script>
import NavFooter from '../site/components/NavFooter'
import NavBar from '../site/components/NavBar'
import RestDAO from '../common/dao/restdao'
import WorkCover from './components/WorkCover'
export default {
  name: 'SharedLink',
  components: {WorkCover, NavBar, NavFooter },
  data () {
    return {
      work: null
    }
  },

  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },

  mounted () {
    this.loadWork()
  },
  methods: {
    async loadWork () {
      this.work = await this.workdao.getOne(this.$route.params.link)
    }
  }
}
</script>

<style scoped>

</style>
