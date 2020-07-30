<template>
  <aside class="insert-container">
    <div class="category-side">
      <div class="category" :class="current === 'block'? 'current': ''" @click="toggleTo('block')">
        <i class="el-icon-office-building" />
        <span>图库</span>
      </div>
      <div class="category" :class="current === 'html'? 'current': ''" @click="toggleTo('html')">
        <i class="el-icon-news" />
        <span>形状</span>
      </div>
      <div class="category" :class="current === 'text'? 'current': ''" @click="toggleTo('text')">
        <i class="el-icon-tickets" />
        <span>文字</span>
      </div>
      <div class="category" :class="current === 'animation'? 'current': ''" @click="toggleTo('animation')">
        <i class="el-icon-data-line" />
        <span>动画</span>
      </div>
      <div class="category" :class="current === 'filter'? 'current': ''" @click="toggleTo('filter')">
        <i class="el-icon-sunrise" />
        <span>滤镜</span>
      </div>
      <div class="category" :class="current === 'addon'? 'current': ''" @click="toggleTo('addon')">
        <i class="el-icon-files" />
        <span>修饰</span>
      </div>
      <div class="category" :class="current === 'image'? 'current': ''" @click="toggleTo('image')">
        <i class="el-icon-picture-outline" />
        <span>我的</span>
      </div>
      <div class="category" :class="current === 'tick'? 'current': ''" @click="toggleTo('tick')">
        <i class="el-icon-service" />
        <span>音乐</span>
      </div>
    </div>
    <div class="element-container">
      <transition name="fade">
        <keep-alive>
          <image-list v-if="current === 'image'" @choose="imageClicked" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <left-block-list v-if="current === 'block'" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <text-list v-if="current==='text'" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <frame-list-config v-if="current === 'animation'" :element="focusedElement" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <tick-list v-if="current === 'tick'" @insert="insertTick" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <left-filter-list v-if="current === 'filter'" :preview="focusedUrl" @insert="insertFilter" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <keep-alive>
          <html-element-list v-if="current === 'html'" />
        </keep-alive>
      </transition>
    </div>
  </aside>
</template>

<script>
import ImageDAO from '../../utils/imagedao'
import RestDAO from '../../utils/restdao.js'
import ImageList from './ImageList.vue'
import LeftShapeList from './ShapeList.vue'
import TextList from './TextList'
import LeftBlockList from './LeftBlockList.vue'
import LeftFilterList from './LeftFilterList.vue'
import TickList from './TickList.vue'
import HtmlElementList from './HtmlElementList.vue'
import FrameListConfig from './FrameListConfig.vue'
import workplaceMixin from '../mixins/workplaceMixins'

export default {
  components: {
    LeftBlockList,
    TextList,
    ImageList,
    LeftFilterList,
    HtmlElementList,
    FrameListConfig,
    TickList
  },
  mixins: [ workplaceMixin ],
  props: {
  },
  data () {
    return {
      current: 'scene'
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

    insertTick (tick) {
      this.$emit('insert', 'tick', tick)
    },

    insertAnimation (animation) {
      this.$emit('insert', 'animation', animation)
    },

    insertFilter (filter) {
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
  .category-side {
    width: 76px;
    background: #0e1318;
    display: flex;
    flex-direction: column;
    .category {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #aaacad;
      padding: 12px 0;
      &:hover {
        cursor: pointer;
        color: #ddd;
      }
      &.current {
        background: #293039;
      }
      i {
        margin: 2px 0 2px;
        font-size: 24px;
      }
      span {
        font-size: 14px;
        display: block;
      }
    }
  }
  .element-container {
    .hint {
      margin: 10px 0;
      color: hsla(0,0%,100%,.5);
    }
    background: #293039;
    width: 352px;
    position: relative;
  }

  input {
    background: rgba(255, 255, 255,.1);
    border: none;
    color: #ddd;
    &:hover {
      box-shadow: none;
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
