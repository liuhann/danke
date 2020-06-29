<template>
  <div id="story-search">
    <div class="header">
      <i class="icon-left-outline" @click="returnHome"></i>
      <input class="query" v-model="query">
       <i class="icon-search-outline" @click="search"></i>
    </div>
    <div class="recent-searches">
      <div class="title-1">最近搜索</div>
      <div class="histories">
        <div class="history" v-for="(history, index) in searchHistory" :key="index" @click="searchFromHistory(history)">{{history}}</div>
      </div>
    </div>
    <div class="search-results">
      <story-list :stories="list" @play="playClicked"></story-list>
      <div class="message" v-if="list.length === 0">
        没有结果
      </div>
    </div>
  </div>
</template>

<script>
import StoryList from './StoryList.vue'
import RestDAO from '../../utils/restdao.js.js'
export default {
  components: {
    StoryList
  },
  data () {
    return {
      searchHistory: [],
      query: '',
      list: []
    }
  },
  created () {
    this.storydao = new RestDAO (this.ctx, 'ybstory/story')
    this.searchHistory = JSON.parse(localStorage.getItem('ybstory-searches') || [])
  },
  methods: {
    returnHome () {
      this.$emit('close')
    },

    playClicked () {
      this.$emit('close')
    },

    async searchFromHistory (history) {
      this.query = history
      const result = await this.storydao.regex('title', this.query, 10)
      this.list = result.result
    },

    async search (title) {
      const result = await this.storydao.regex('title', this.query, 10)
      this.searchHistory.push(this.query)
      localStorage.setItem('ybstory-searches', JSON.stringify(this.searchHistory))
      this.list = result.result
    }
  }
}
</script>

<style lang="scss">
#story-search {
  margin-top: -3.25rem;
  .header {
    color: #fff;
    font-size: 1rem;
    display: flex;
    line-height: 3.25rem;
    i {
      flex: 1;
      text-align: center;
    }
    input.query {
      border: none;
      font-size: 1rem;
      background: transparent;
      color: #fff;
      border-bottom: 1px solid #fff;
      width: 70%;
      height: 2.5rem;
    }
  }
  .search-results {
    background: #fff;
    margin: 1rem;
    padding: 1rem 0;
    .message {
      height: 6rem;
      background-color: transparent;
      text-align: center;
      color: #333;
      line-height: 6rem;
    }
  }
  .recent-searches {
    color: #333;
    padding: .25rem;
    background: #fff;
    margin: 1rem;
    font-size: 1rem;
    .title-1 {
      color: #999;
      margin: .5rem 0;
    }
    .history {
      background: #FD8735;
      color: #fff;
      display: inline-block;
      padding: .25rem .75rem;
      border-radius: .3rem;
      margin-right: .5rem;
    }
  }
}
</style>
