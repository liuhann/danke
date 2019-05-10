<template>
<section class="section">
  <div class="columns is-mobile is-multiline">
    <div class="column is-full-mobile is-two-thirds-desktop">
      <h2 class="subtitle"><i class="icon-thumbs-up" style="color: #41C4FF;"></i> 故事推荐</h2>
      <story-grids :stories="samples"></story-grids>
    </div>
    <div class="column is-full-mobile is-one-third-desktop">
      <h2 class="subtitle"><i class="icon-user-outline" style="color: #FFD500;"></i>今日主播: {{teller.name}}</h2>
      <story-list :stories="teller.list"></story-list>
    </div>
    <div v-for="labelStories in labels" :key="labelStories.name" class="column is-full-mobile is-one-third-desktop">
      <h2 class="subtitle"><i class="icon-bookmark" style="color: #F262D3;"> </i>{{labelStories.name}}</h2>
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
  background: #FFFFFF;
  border-top-right-radius: .5rem;
  border-top-left-radius: .5rem;

  >.columns>.column {
    margin-top: 1rem;
  }
  .subtitle {
    color: #383838;
    padding: .2rem .5rem;
  }
}
</style>
