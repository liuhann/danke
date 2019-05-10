<template>
<div class="story-list">
  <article class="media" v-for="(story, index) in stories" :key="index" @click="playStory(story)">
    <figure class="media-left">
      <p class="image is-64x64">
        <img :src="CDN_IMG + '/' + story.cover + '.png@w_64,h_64,s_2,q_100'" :alt="story.title">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          {{story.title}}
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item tag is-primary" v-if="story.artist">
            {{story.artist}}
          </a>
          <a class="level-item">
            时长: {{story.duration | timeFormat}}
          </a>
        </div>
      </nav>
    </div>
  </article>
</div>
</template>
<script>
import mixins from './mixins.js'
export default {
  name: "StoryList",
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
.story-list {
  .media-content {
    color: #2E2E2E;
  }
}
</style>


