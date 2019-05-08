<template>
<section class="section">
  <div class="columns is-mobile is-multiline">
    <div class="column is-full-mobile is-two-thirds-desktop">
      <h2 class="subtitle">故事推荐</h2>
      <story-grids :stories="samples"></story-grids>
    </div>
    <div class="column is-full-mobile is-one-third-desktop">
      <h2 class="subtitle">今日主播: {{teller.name}}</h2>
      <story-list :stories="teller.list"></story-list>
    </div>
    <div v-for="labelStories in labels" :key="labelStories.name" class="column is-full-mobile is-one-third-desktop">
      <h2 class="subtitle">{{labelStories.name}}</h2>
      <story-list :stories="labelStories.stories.list"></story-list>
    </div>
  </div>
</section>
</template>
<script>
import StoryGrids from './StoryGrids.vue'
import StoryList from './StoryList.vue'
import StoryDAO from './storydao.js';
export default {
  name: 'StoryHome',
  components: { StoryGrids, StoryList, StoryDAO },
  data () {
    return {
      samples: [],
      teller: {
        name: '',
        list: []
      },
      labels: []
    }
  },
  created () {
    this.storydao = new StoryDAO(this.ctx)
    this.loadHome()
  },
  methods: {
    async loadHome () {
      const home = await this.storydao.listHome()
      this.samples = home.samples
      this.teller = home.teller
      this.labels = home.labels
    }
  }
}
</script>

<style lang="scss">
.section {
  >.columns>.column {
    margin-top: 1rem;
  }
  .subtitle {
    padding: .2rem .5rem;
  }
}
</style>
