<template>
<div class="columns is-mobile is-multiline">
  <div class="column is-half-mobile is-one-third-desktop" v-for="(story, index) in stories" :key="index">
    <div class="card">
      <div class="card-image">
        <figure class="image is-4by3">
          <img :src="CDN_IMG + '/' + story.cover + '.png@w_200,h_150,s_2,q_100'" alt="Placeholder image">
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-6">{{story.title}}</p>
          </div>
        </div>
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
  methods: {}
}
</script>

<style lang="scss">
</style>


