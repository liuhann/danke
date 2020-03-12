<template>
<aside class="insert-container">
  <div class="category-side">
    <div class='category' :class="current === 'scene'? 'current': ''" @click="toggleTo('scene')">
      <i class="el-icon-files"/>
      <span>场景</span>
    </div>
    <div class="category" :class="current === 'image'? 'current': ''" @click="toggleTo('image')">
      <i class="el-icon-picture-outline"/>
      <span>图片</span>
    </div>
    <div class='category' :class="current === 'text'? 'current': ''" @click="toggleTo('text')">
      <i class="el-icon-tickets"/>
      <span>文字</span>
    </div>
    <div class='category' :class="current === 'shape'? 'current': ''" @click="toggleTo('shape')">
      <i class="el-icon-news"/>
      <span>形状</span>
    </div>
    <div class='category'>
      <i class="el-icon-magic-stick"/>
      <span>效果</span>
    </div>
    <div class='category'>
      <i class="el-icon-service"/>
      <span>音乐</span>
    </div>
     <div class='category'>
      <i class="el-icon-service"/>
      <span>音乐</span>
    </div>
  </div>
  <div class="element-container">
    <transition name="fade">
      <keep-alive>
        <image-upload v-if="current === 'image'"/>
      </keep-alive>
    </transition>
    <transition name="fade">
      <keep-alive>
        <left-scene-template v-if="current === 'scene'" @insert="insertNewScene"/>
      </keep-alive>
    </transition>
    <transition name="fade">
      <keep-alive>
        <text-list v-if="current==='text'" />
      </keep-alive>
    </transition>
    <transition name="fade">
      <keep-alive>
        <left-shape-list v-if="current === 'shape'" />
      </keep-alive>
    </transition>
  </div>
</aside>
</template>

<script>
import ImageDAO from '../utils/imagedao'
import RestDAO from '../../common/dao/restdao'
import ImageUpload from './ImageList.vue'
import LeftSceneTemplate from './SceneList.vue'
import LeftShapeList from './ShapeList.vue'
import TextList from './TextList'

export default {
  components: {
    TextList,
    ImageUpload,
    LeftSceneTemplate,
    LeftShapeList
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
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 16px;
    width: 352px;
    position: relative;
    overflow-y: auto;
  }
}
</style>
