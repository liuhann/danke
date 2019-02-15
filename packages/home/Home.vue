<template>
<div class="home">
  DANKE Home
  <a href="#/designer">Designer</a>


  <ul>
    <li v-for="work in works">
      <router-link :to="'/designer/' + work.id">{{work.id}} - {{work.scenes}}</router-link>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      works: []
    }
  },
  created () {
    this.listWork()
  },
  methods: {
    async listWork () {
      const result = await this.ctx.workdao.listMine()
      this.works = result.list
    }
  }
}
</script>
