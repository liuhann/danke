<template>
  <div class="story-manage">
    <div class="play" v-if="currentPlaying">
      <audio :src="currentPlaying" controls="controls" loop="loop" autoplay="autoplay"></audio>
    </div>
    <div class="query">
      <div >标题 <input v-model="titleSearch"> <a @click="searchStory">搜索</a></div>
    </div>
    <div class="pager">
      <a @click="jumpPage(-1)">上页</a>
      <a @click="jumpPage(1)">下页</a>
      <input v-model.number="currentPage">
      <a @click="jumpPage(0)">跳转</a>
    </div>
    <div class="story-list">
      <table>
        <tr>
          <th>标题</th>
          <th>专辑</th>
          <th>标签</th>
          <th>主播</th>
          <th style="">路径</th>
          <th style="width: 160px">操作</th>
        </tr>
        <tr class="one-story" v-for="story in tableData" :key="story._id">
          <td><input style="width: 300px;" v-model="story.title"></td>
          <td><input v-model="story.album"></td>
          <td><input v-model="story.label"></td>
          <td><input v-model="story.teller"></td>
          <td>{{story.path}}</td>
          <td>
            <a @click="saveStory(story)">更新</a>
            <a @click="playStory(story)">播放</a>
            <a @click="deleteStory(story)">删除</a>
          </td>
        </tr>
      </table>
    </div>
    <div class="pager">
      <a @click="jumpPage(-1)">上页</a>
      <a @click="jumpPage(1)">下页</a>
      <input v-model.number="currentPage">
      <a @click="jumpPage(0)">跳转</a>
    </div>
  </div>
</template>

<script>
import RestDAO from '../common/restdao.js'
export default {
  data: function () {
    return {
      CDN_IMG: 'http://imagek.cdn.bcebos.com',
      search: {
        path: ''
      },
      titleSearch: '',
      pageToGo: '',
      queryText: '',
      showRelatedStory: false,
      showSearchDialog: false,
      relatedStories: [],
      currentPage: 1,
      pageSize: 50,
      total: 0,
      tableData: [],
      loading: false,
      currentPlaying: null,
      dialogFormVisible: false,
    }
  },

  created () {
    this.storydao = new RestDAO (this.ctx, 'ybstory/story')
  },
  mounted () {
    this.loadCurrentPage()
  },
  methods: {
    async searchStory () {
      const result = await this.storydao.regex('title', this.titleSearch)
      this.tableData = result.result
    },
    jumpPage (inc) {
      this.currentPage += inc
      this.loadCurrentPage()
    },
    async loadCurrentPage () {
      this.loading = true
      const result = await this.storydao.list({}, this.currentPage, this.pageSize)
      this.loading = false
      this.tableData = result.list
      this.total = result.total
    }, 
    async saveStory (story) {
      try {
        await this.storydao.patch(story._id, {
          title: story.title,
          album: story.album,
          label: story.label,
          teller: story.teller
        })
      } catch (e) {
      }
    },
    async playStory (story) {
      this.currentPlaying = 'http://chuchu.cdn.bcebos.com/' + story.path
    },
    async deleteStory (story) {
      await this.storydao.patch(story._id, {
        deleted: true
      })
    }
  }
}
</script>

<style lang="scss">
body {
  background: #fff;
}
.pager {
  a {
    margin: 0 5px;
  }
  input {
    width: 50px;
  }
}
.story-list {
  a {
    margin: 0 5px;
  }
}
</style>
