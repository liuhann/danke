<template>
  <aside class="insert-container">
    <vertical-tab v-model="current" :tabs="tabs" />
    <div class="tab-content-container">
      <progress v-show="vectorLoading" class="progress is-small is-success" max="100"></progress>
      <el-upload
        v-if="current==='uploads'"
        :auto-upload="false"
        action="none"
        accept="image/*"
        :show-file-list="false"
        multiple
        class="upload-container"
        :on-change="fileChoosed"
      >
        <button class="button is-fullwidth is-primary">上传图片</button>
      </el-upload>
      <collapable-list v-if="vectors.length" :loading="vectorLoading" :column="3" :items="vectors" :icon-size="current==='uploads' ? 1: 0.5"
                       :item-commands="current==='uploads' ? [{
                         label: '删除',
                         value: 'upload-delete'
                       }]: []"
                       :style-item-content="{
                         borderRadius: '10px',
                         backgroundColor: 'rgba(255, 255, 255, .05)',
                         boxShadow: '0 1px 6px 0 rgb(32 33 36 / 28%)'
                       }"
                       @command="onListItemCommand"
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
import CollapableList from '../../common/components/CollapableList.vue'
import { shortid } from '../../utils/string'

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
      this.onTabChange ()
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.uploadsdao = new RestDAO(this.ctx, `danke/image`)
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
  },

  mounted () {
    this.onMounted()
  },
  methods: {

    onMounted () {
      this.fetchPacks()
    },

    onTabChange() {
      switch (this.current) {
        case 'uploads':
          this.fetchMyUploads()
          break;
        default:
          this.fetchPackVectors(this.current)
      }
    },

    async fetchMyUploads () {
      this.vectorLoading = true
      this.vectors = (await this.uploadsdao.list({
          page: 1,
          count: 100
      })).list
      this.vectorLoading = false
    },

    async fetchPacks () {
      this.vectorLoading = true
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
      this.tabs.push({
        value: 'uploads',
        icon: 'fa fa-image'
      })
      this.current = this.tabs[0].value
    }, 
    
    fileExtension (fname) {
      return fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
    },

    async fileChoosed (file, fileList) {
      const imageObject = await this.imagedao.fileChoosed(file, fileList, `users/${this.ctx.user.id}/` + shortid() + '.' + this.fileExtension(file.name))
      // write file info
      await this.uploadsdao.create(imageObject)
      this.fetchMyUploads()
    },

    async onListItemCommand ({ cmd, item }) {
      if (cmd === 'upload-delete') {
         // 删除阿里云存储的图片
        await this.imagedao.removeBlob(item.url)
        // 删除rest记录
        await this.uploadsdao.delete(item)
        this.fetchMyUploads()
      }
    },

    async fetchPackVectors (packId) {
      this.vectorLoading = true
      this.vectors = []
      const response = await this.restdao.list({
        pack: this.current,
        page: 1,
        count: 100
      })
      this.vectors = response.list
      this.vectorLoading = false
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
    .el-upload {
      width: 100%;
      padding: 10px 20px 5px;
    }
    progress {
      margin-bottom: 0;
      border-radius: 0;
      position: absolute;
      height: 2px;
      background-color: transparent;
    }
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
