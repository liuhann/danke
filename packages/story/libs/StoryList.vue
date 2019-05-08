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
          <strong>{{story.title}}</strong>
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" v-if="story.artist">
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
export default {
  name: "StoryList",
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
  filters: {
    timeFormat: function (t) {
      try {
        const i = parseInt(t)
        return Math.floor(i / 60) + '分' + i%60 + '秒'
      } catch (e) {
        return '未知'
      }
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
</style>


