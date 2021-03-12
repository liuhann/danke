<template>
  <van-popup v-model="show" title="Hi" position="bottom" :style="{ height: '100%'}" class="pop-unsplash-list" @opened="loadPhotos">
    <van-nav-bar>
      <template #right>
        <van-icon name="close" size="20" @click="show = false" />
      </template>
      <template #left>
        {{ title }}
      </template>
    </van-nav-bar>
    <van-skeleton v-if="fetching" title :row="6" />
    <van-grid clickable square :icon-size="48" column-num="4">
      <van-grid-item v-for="(photo, index) in photos" :key="index" @click="choose(photo)">
        <van-image
          width="100"
          height="100"
          lazy-load
          :src="photo + '&q=90&w=100&h=100&fit=crop'"
        />
      </van-grid-item>
    </van-grid>
  </van-popup>
</template>

<script>

export default {
  name: "PopUnSplashPhotoList",
  props: {},
  data () {
    return {
      title: '',
      query: '',
      show: false,
      fetching: false,
      photos: []
    }
  },
  created () {

  },
  mounted () { },
  methods: {
    open (title, query) {
      this.photos = []
      this.show = true
      this.title = title
      this.query = query
    },
    close () {
      this.photos = []
      this.show = false
    },
    choose (url) {
      this.show = false
      this.$emit('insert', {
        w: 960,
        h: 960,
        url: url + '&q=90&w=960&h=960&fit=crop'
      })
    },
    async loadPhotos () {
      this.fetching = true
      this.photos = []
      const result = await this.ctx.get(`/unsplash/photo/find?query=${this.query}`)
      this.photos = result.data.data.photos
      this.fetching = false
    }
  }
}
</script>

<style lang="scss">
.pop-unsplash-list .van-grid-item {
  overflow: hidden;
}
</style>
