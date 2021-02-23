<template>
  <aside class="insert-container">
    <vertical-tab v-model="current" :tabs="tabs" />
    <div class="tab-content-container">
      <vector-album-list :album-tag="current" />
    </div>
  </aside>
</template>

<script>
import ImageDAO from '../../utils/imagedao'
import RestDAO from '../../utils/restdao.js'
import ImageList from './ImageList.vue'
import VerticalTab from '../components/VerticalTab.vue'
import VectorAlbumList from './VectorAlbumList'

export default {
  components: {
    VectorAlbumList,
    VerticalTab,
    ImageList
  },
  props: {},
  data () {
    return {
      current: 'basic',
      tabs: [{
        value: 'basic',
        icon: 'el-icon-news',
        label: '形状'
      }, {
        value: 'icon',
        icon: 'el-icon-news',
        label: '图标'
      }, {
        value: 'svg',
        icon: 'el-icon-news',
        label: '素材'
      }, {
        value: 'svg',
        icon: 'el-icon-news',
        label: '视频'
      }, {
        value: 'upload',
        icon: 'el-icon-news',
        label: '上传'
      }, {
        value: 'pictures',
        icon: 'el-icon-news',
        label: '图库'
      }]
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.restdao = new RestDAO(this.ctx, 'danke/image')
  },
  methods: {
    async fileChoosed (file) {
      const result = await this.imagedao.uploadBlob(file.raw, `images`)
      await this.restdao.create({
        url: result.name,
        name: file.name,
        size: file.size
      })
      this.$refs.myImageList.refresh()
    },

    toggleTo (nav) {
      this.current = nav
    },

    // 增加新的场景
    insertNewScene (scene) {
      this.$emit('insert', 'scene', scene)
    },

    insertElement (element) {
      this.$emit('insert', 'element', element)
    },
    tryApplySVGMask (element) {
      if (element.svg && this.focusedElement && this.focusedElement.hasOwnProperty('mask')) {
        this.focusedElement.mask = {
          uid: element.uid,
          svg: element.svg
        }
      }
    },
    insertTick (tick) {
      this.$emit('insert', 'tick', tick)
    },

    insertAnimation (animation) {
      this.$emit('insert', 'animation', animation)
    },

    insertFilter (filter) {
      if (filter) {

      }
      this.$emit('replace', filter)
    },

    imageClicked (image) {
      this.$emit('replace', image)
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
