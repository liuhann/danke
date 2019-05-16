<template>
  <div id="album-discover">
    <div class="albums" v-if="!currentAlbum">
      <div class="album" v-for="album in albums" :key="album._id" @click="openAlbum(album)">
        <p class="image">
          <img :src="album.cover" :alt="album.title">
        </p>
        <div class="album-title">{{album.desc}}</div>
        <div class="album-desc">{{album.stories}}个故事</div>
      </div>
    </div>
    <div class="album-stories" v-if="currentAlbum">
      <div class="album">
        <p class="album-cover">
          <i class="icon-left-outline" @click="returnAlbumList"></i>
          <img :src="currentAlbum.cover" :alt="currentAlbum.title">
        </p>
        <div class="album-title">{{currentAlbum.desc}}</div>
        <div class="album-desc">{{currentAlbum.stories}}个故事</div>
      </div>
      <story-list :stories="albumStories"></story-list>
    </div>
  </div>
</template>

<script>
import RestDAO from '../../common/restdao.js'
import StoryList from './StoryList.vue'
export default {
  components: { StoryList },
  data () {
    return {
      currentAlbum: null,
      albums : [],
      albumStories: []
    }
  },
  created () {
    this.albumdao = new RestDAO (this.ctx, 'ybstory/album')
    this.storydao = new RestDAO (this.ctx, 'ybstory/story')
    this.loadAlbums()
  },

  filters: {
    albumCover (url) {
      
    }
  },

  methods: {
    async loadAlbums () {
      try {
        const result = await this.albumdao.list({
          sort: 'u',
          order: '-1',
          page: 1,
          count: 100
        })
        this.albums = result.list
      } catch (err) {
        alert(err.message)
      }
    },

    returnAlbumList () {
      this.currentAlbum = null
      this.albumStories = []
    },

    async openAlbum (album) {
      this.currentAlbum = album
      this.albumStories = (await this.storydao.regex('album', album.name)).result
    }
  }
}
</script>

<style lang="scss">
.album {
  margin-bottom: 1rem;
  background: #fff;
  color: #666;
  .album-title {
    line-height: 2rem;
    font-size: 1rem;
    padding: 0 .5rem;
  }
  .album-desc {
    padding: 0 .5rem;
  }
}

.album-stories {
  .album-cover {
    position: relative;
    .icon-left-outline {
      font-size: 1.25rem;
      float: right;
      height: 2rem;
      width: 2rem;
      color: #fff;
      left: .5rem;
      top: .5rem;
      position: absolute;
    }
  }
}
</style>
