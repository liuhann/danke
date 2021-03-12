<template>
  <aside class="insert-container">
    <vertical-tab v-model="current" :tabs="tabs" />
    <div class="tab-content-container">
      <collapable-list v-if="vectors.length" :loading="vectorLoading" :column="3" :items="vectors" :style-item-content="{
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, .05)',
        boxShadow: '0 1px 6px 0 rgb(32 33 36 / 28%)'
      }"
      />
    </div>
  </aside>
</template>

<script>
import ImageDAO from '../../utils/imagedao'
import RestDAO from '../../utils/restdao.js'
import ImageList from './ImageList.vue'
import VerticalTab from '../components/VerticalTab.vue'
import VectorAlbumList from './VectorAlbumList'
import { getImageUrl } from '../../utils/getImageUrl'
import CollapableList from '../../common/components/CollapableList'

export default {
  components: {
    VectorAlbumList,
    VerticalTab,
    CollapableList,
    ImageList
  },
  props: {},
  data () {
    return {
      vectorLoading: false,
      current: null,
      vectors: [],
      tabs: []
    }
  },

  watch: {
    current () {
      this.fetchPackVectors ()
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
  },

  mounted () {
    this.fetchPacks()
  },
  methods: {

    onMounted () {
      this.fetchPacks()

    },

    async fetchPacks () {
      const result = await this.packdao.list({
        page: 1,
        count: 40,
        tags: 'basic'
      })

      for (let pack of result.list) {
        this.tabs.push({
          value: pack._id,
          icon: getImageUrl(pack.url)
        })
      }
      this.current = this.tabs[0].value
    },

    async fetchPackVectors () {
      this.vectorLoading = true
      this.vectors = []
      const response = await this.restdao.list({
        pack: this.current,
        page: 1,
        count: 100
      })
      this.vectors = response.list
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

aside.insert-container {
  flex-shrink: 0;
  position: relative;
  display: flex;

  .tab-content-container {
    .hint {
      margin: 10px 0;
      color: hsla(0,0%,100%,.5);
    }
    background: #293039;
    width: 352px;
    position: relative;
    overflow: overlay;
  }

  ::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #293039;
  }

  ::-webkit-scrollbar
  {
    width: 5px;
    height: 5px;
    background-color: rgba(41, 48, 57, 0.39);
  }

  ::-webkit-scrollbar-thumb
  {
    background-color: #3b4a53;
  }

}
</style>
