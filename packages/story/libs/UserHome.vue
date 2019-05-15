<template>
<div id="user-home">
  <div class="navs">
    <div class="nav" @click="showHistories">
      <i class="icon-bookmark"></i>
      <span>播放历史</span>
      <span class="count">({{historyCount}})</span>
    </div>
    <div class="histories" v-if="historyShow">
      <div v-if="histories.day3.length" class="sub-title">最近收听</div>
      <story-list :stories="histories.day3"></story-list>
      <div v-if="histories.day7.length" class="sub-title">最近一周</div>
      <story-list :stories="histories.day7"></story-list>
      <div v-if="histories.olders.length" class="sub-title">更早</div>
      <story-list :stories="histories.olders"></story-list>
    </div>
    <div class="nav" @click="showFavorites">
      <i class="icon-heart-1"></i>
      <span>收藏</span>
      <span class="count">({{favoriteCount}})</span>
    </div>
    <div class="favorites" v-if="favoriteShow">
      <story-list :stories="favorites"></story-list>
    </div>
  </div>
</div>  
</template>

<script>
import StoryList from './StoryList.vue'
export default {
  components: { StoryList },
  data () {
    return {
      historyCount: this.ctx.localdao.histories.length,
      favoriteCount: this.ctx.localdao.favorites.length,
      historyShow: false,
      favoriteShow: false,
      favorites: this.ctx.localdao.favorites,
      histories: this.ctx.localdao.getHistories()
    }
  },
  methods: {
    showHistories () {
      this.historyShow = !this.historyShow
    },
    showFavorites () {
      this.favoriteShow = !this.favoriteShow
    }
  }
}
</script>

<style lang="scss">
#user-home {
  .navs {
    background: #fff;
    .nav {
      border-bottom: 1px solid #ccc;
      height: 3rem;
      line-height: 3rem;
      color: #555;
      padding: 0 .5rem;
    }
  }
  .sub-title {
    padding: 0 .5rem;
  }
}
</style>
