<template>
  <aside class="insert-container">
    <category-tab v-model="current" />
    <div class="element-container">
      <transition name="fade">
        <keep-alive>
          <public-image-gallery v-if="current === 'gallery'" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <public-vector-gallery v-if="current === 'vector'" @choose="tryApplySVGMask" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <public-html-list v-if="current === 'h5'" @choose="tryApplySVGMask" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <image-list v-if="current === 'image'" @choose="imageClicked" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <tick-list v-if="current === 'tick'" @insert="insertTick" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <left-filter-list v-if="current === 'filter'" @insert="applyFilter" @clean="cleanFilter" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <left-shape-list v-if="current === 'html'" @svg="tryApplySVGMask" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <resource-more v-if="current === '3rd'" />
        </keep-alive>
      </transition>
    </div>
  </aside>
</template>

<script>
import ImageDAO from '../../utils/imagedao'
import RestDAO from '../../utils/restdao.js'
import ImageList from './ImageList.vue'
import PublicImageGallery from './PublicImageGallery.vue'
import PublicVectorGallery from './PublicVectorGallery.vue'
import PublicHtmlList from './PublicHTMLList'
import LeftFilterList from './LeftFilterList.vue'
import TickList from './TickList.vue'
import ResourceMore from './ResourceMore.vue'
import LeftShapeList from './LeftShapeList.vue'
import FrameListConfig from './FrameListConfig.vue'
import workplaceMixin from '../mixins/sceneEditContainer'
import svgToMiniDataURI from 'mini-svg-data-uri'
import CategoryTab from '../components/CategoryTab'

export default {
  components: {
    CategoryTab,
    PublicImageGallery,
    PublicVectorGallery,
    PublicHtmlList,
    ImageList,
    LeftFilterList,
    LeftShapeList,
    ResourceMore,
    TickList
  },
  mixins: [ workplaceMixin ],
  props: {},
  data () {
    return {
      current: 'gallery'
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

  .element-container {
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
