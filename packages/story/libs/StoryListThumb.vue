<template>
<div class="story-list-thumb">
  <article v-for="(story, index) in stories" :key="index" @click="playStory(story)">
    <p class="image is-square">
      <img :src="CDN_IMG + '/' + story.cover + '.png@w_120,h_120,s_2,q_100'" :alt="story.title">
    </p>
    <div class="media-content">
        {{story.title}}
    </div>
  </article>
</div>
</template>
<script>
import mixins from './mixins.js'
export default {
  name: "StoryListThumb",
  mixins: [ mixins ],
  props: {
    stories: {
      type: Array
    }
  },
  data() {
    return {
    }
  },
  methods: {
     playStory (story) {
      this.ctx.playStory(story)
    }
  }
};
</script>

<style lang="scss">
.story-list-thumb {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  article {
    width: 30%;
    .media-content {
      margin: .5rem 0;
      color: #2E2E2E;
      font-size: 1rem;
      line-height: 1.5rem;
      height: 1.5rem;
    }
  }
}
</style>


