<template>
<div class="story-list">
  <article v-for="(story, index) in stories" :key="index" @click="playStory(story)">
    <figure>
      <p class="image is-64x64">
        <img :src="CDN_IMG + '/' + story.cover + '.png@w_64,h_64,s_2,q_100'" :alt="story.title">
      </p>
    </figure>
    <div>
      <div class="content">
        <p class="story-title">
          {{story.title}}
        </p>
        <p>
          <a v-if="story.artist">
            {{story.artist}}
          </a>
          <a>
            时长: {{story.duration | timeFormat}}
          </a>
        </p>
      </div>
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
       this.$emit('play')
      this.ctx.playStory(story)
    }
  }
};
</script>

<style lang="scss">
.story-list {
  background: #fff;
  .media-content {
    color: #2E2E2E;
  }
  article {
    display: flex;
    padding: .5rem;
    border-bottom: 1px solid #ddd;    
  }
  .story-title {
    color: #2E2E2E;
  }
}
</style>


