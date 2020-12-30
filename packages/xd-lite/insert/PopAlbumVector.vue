<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '360px'}" class="pop-album-vector" @opened="opened">
    <slot></slot>
    <div ref="packListWrapper" class="pack-list-wrapper">
      <ul class="album-list-container">
        <li v-for="pack in packs" :key="pack._id" class="pack" :class="currentPack===pack?'selected': ''" @click="openPack(pack)"><van-image width="36" height="36" :src="getImageUrl(pack.previews[0])" /></li>
      </ul>
    </div>
    <div ref="vectorListWrapper" class="vector-list-wrapper">
      <ul class="vector-list-container">
        <li v-for="vector in vectors" :key="vector._id" class="vector">
          <van-image width="50" height="50" :src="getImageUrl(vector.url)" @click="chooseVector(vector)" />
        </li>
      </ul>
    </div>
  </van-popup>
</template>

<script>
import RestDAO from '../../utils/restdao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
export default {
  name: "PopAlbumVector",
  data() {
    return {
      vectorFetching: false,
      show: false,
      packs: [],
      vectors: [],
      currentPack: null,
      currentPage: 1,
      pageCount: 10,
      deviceWidth: 0,
      total: -1
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
  },
  methods: {
    getImageUrl,
    open(tag) {
      this.tag = tag
      this.show = true
    },
    async opened () {
      this.deviceWidth = window.screen.availWidth
      await this.fetchMorePacks()
      if (this.packs.length) {
        this.openPack(this.packs[0])
      }
    },

    async openPack (pack) {
      this.currentPack = pack
      this.vectorFetching = true
      this.vectors = []
      const query = {
        page: 1,
        count: 500,
        pack: this.currentPack._id
      }
      const result = await this.restdao.list(query)
      result.list.forEach(vector => vector.tags = this.currentPack.tags)
      this.vectors = result.list
      this.vectorFetching = false
    },

    chooseVector (vector) {
      this.$emit('input', vector)
    },

    async fetchMorePacks () {
      const result = await this.packdao.list({
        page: this.currentPage,
        count: this.pageCount,
        tags: this.tag
      })
      this.packs = result.list
      this.total = result.total
    },
  }
}
</script>

<style lang="scss">
.pack-list-wrapper {
  width: 100%;
  height: 64px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border-bottom: 1px solid #E2E2E2;
  .album-list-container {
    background: #F7F7F7;
    display: flex;
    li {
      margin: 7px;
      padding: 7px;
      width: 50px;
      height: 50px;
      &.selected {
        background: #ffffff;
        border-radius: 5px;
      }
    }
  }
}

.vector-list-wrapper {
  width: 100%;
  height: 290px;
  overflow-y: auto;
  background: #f9f9f9;
  overflow-x: hidden;
  border-top: 1px solid #f9f9f9;
  .vector-list-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    li {
      height: 90px;
      width: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
