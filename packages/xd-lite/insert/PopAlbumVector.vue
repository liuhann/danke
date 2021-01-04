<template>
  <van-popup v-model="show" position="bottom" class="pop-album-vector" :overlay="false" closeable close-icon="arrow-down" @opened="opened">
    <van-tabs swipeable @change="onTabChange">
      <van-tab v-for="tab in tabs" :key="tab.key" :title="tab.title" :name="tab.key"></van-tab>
    </van-tabs>
    <div v-if="contentType === 'pack'">
      <div ref="packListWrapper" class="pack-list-wrapper">
        <van-skeleton v-if="packs.length === 0" :row="1" />
        <ul class="album-list-container">
          <li v-for="pack in packs" :key="pack._id" class="pack" :class="currentPack===pack?'selected': ''" @click="openPack(pack)"><van-image width="30" height="30" :src="getImageUrl(pack.previews[0])" /></li>
        </ul>
      </div>
      <div ref="vectorListWrapper" class="vector-list-wrapper">
        <van-skeleton v-if="vectors.length === 0" title :row="3" />
        <ul class="vector-list-container">
          <li v-for="vector in vectors" :key="vector._id" class="vector">
            <van-image width="50" height="50" :src="getImageUrl(vector.url)" @click="choose(vector)" />
          </li>
        </ul>
      </div>
    </div>
    <my-uploads v-if="contentType === 'upload'" @insert="choose" />
    <basic-element-list v-if="contentType === 'basic'" @insert="choose" />
  </van-popup>
</template>

<script>
import RestDAO from '../../utils/restdao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
import BasicElementList from '../list/BasicElementList.vue'
import MyUploads from '../list/MyUploads'
export default {
  name: "PopAlbumVector",
  components: { 
    MyUploads, 
    BasicElementList
  },
  data() {
    return {
      contentType: '',
      tabs: [],
      currentPack: {},
      vectorFetching: false,
      show: false,
      packs: [],
      vectors: [],
      currentTab: null,
      currentPage: 1,
      pageCount: 10,
      deviceWidth: 0,
      action: null,
      total: -1
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
  },

  methods: {
    getImageUrl,
    open(tabs, action) {
      this.tabs = tabs
      this.action = action
      this.currentTab = this.tabs[0]
      this.contentType = this.currentTab.type
      this.show = true
    },
    close () {
      this.show = false
    },
    async opened () {
      this.tabSwitched()
    },

    async tabSwitched() {
      this.contentType = this.currentTab.type
      this.packs = []
      this.vectors = []
      if (this.currentTab.type === 'pack') {
        await this.fetchMorePacks(this.currentTab.key)
        if (this.packs.length) {
          this.openPack(this.packs[0])
        }
      }
    },

    onTabChange (name) {
      this.currentTab = this.tabs.filter(tab => tab.key === name)[0]
      this.tabSwitched()
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

    choose (vector) {
      if (this.action) {
        this.$emit(this.action, vector)
        this.show = false
      } else {
        this.$emit('input', vector)
      }
    },

    async fetchMorePacks (tag) {
      if (this.currentTab) {
        this.contentType = this.currentTab.type
        if (this.currentTab.type === 'pack') {
          const result = await this.packdao.list({
            page: this.currentPage,
            count: this.pageCount,
            tags: this.currentTab.key
          })
          this.packs = result.list
          this.total = result.total
        }
      }
    },
  }
}
</script>

<style lang="scss">
.pop-album-vector {
  .van-skeleton {
   padding-top: 20px;
  }
  border-top: 1px solid #eee;
  .van-tabs {
    width: calc(100vw - 48px);
  }
  .van-popup__close-icon--top-right {
    top: 12px;
  }
}
.pack-list-wrapper {
  width: 100%;
  height: 54px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border-bottom: 1px solid #E2E2E2;
  .album-list-container {
    background: #F7F7F7;
    display: flex;
    li {
      margin: 6px;
      padding: 6px;
      width: 42px;
      height: 42px;
      &.selected {
        background: #ffffff;
        border-radius: 5px;
      }
    }
  }
}

.vector-list-wrapper {
  width: 100%;
  height: 200px;
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
