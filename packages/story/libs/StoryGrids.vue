<template>
<div class="columns is-mobile is-multiline story-grids">
  <div class="column is-one-third-mobile is-one-six-desktop" v-for="(story, index) in stories" :key="index" @click="playStory(story)">
      <figure class="image is-4by3">
        <img :src="CDN_IMG + '/' + story.cover + '.png@w_200,h_180,s_2,q_100'" :alt="story.title">
      </figure>
      <div class="media">
        <div class="media-content">
          <p class="title is-6">{{story.title}}</p>
        </div>
      </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'StoryGrids',
  props: {
    stories: {
      type: Array
    }
  },
  data() {
    return {
      CDN_IMG: this.ctx.CDN_IMG
    }
  },
  methods: {
    playStory (story) {
      this.ctx.playStory(story)
    }
  }
}
</script>

<style lang="scss">
.story-grids {
  padding: 0 .8rem!important;
  margin-bottom: 1rem!important;
  .column {
    padding: .4rem!important;
  }

  .media-content {
    .title {
      line-height: 2rem;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 1.5rem;
    }
  }
}
</style>


