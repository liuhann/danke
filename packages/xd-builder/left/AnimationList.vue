<template>
<div id="left-animation-tab">
  <tabs v-model="animationType" @tab-click="handleClick">
    <tab-pane label="进入动画" name="enter"></tab-pane>
    <tab-pane label="离开动画" name="exist"></tab-pane>
  </tabs>
  <div class="animation-container" v-infinite-scroll="loadMoreAnimation">
    <div v-for="(animation, index) in animations" :key="index"  class="animation-item"
         @mouseenter="animationMouseEnter(animation)"
         @click="addAnimation(animation)">
      <div class="preview-box" :class="animation.name">
        <img :src="CLOUD_HILL" v-if="animation.tags.indexOf('text') === -1"/>
        <span v-if="animation.tags.indexOf('text') > -1">{{animation.title}}</span>
      </div>
      <div v-if="animation.tags.indexOf('text') === -1" class="animation-title">{{animation.title}}</div>
    </div>
  </div>
  <pagination :total="total" :page-size="pageSize" @current-change="loadMoreAnimation" :current-page.sync="page" :pager-count="5" layout="prev, pager, next" />
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import { Pagination, Tabs, TabPane, InfiniteScroll } from 'element-ui'
import CLOUD_HILL from '../../vectors/cloud-hill.webp'
export default {
  name: 'AnimationList',
  components: {
    Pagination,
    Tabs,
    TabPane
  },
  directives: {
    InfiniteScroll
  },
  props: {
    type: {
      type: String
    }
  },
  data () {
    return {
      animationType: 'enter',
      CLOUD_HILL,
      animations: [],
      page: 0,
      pageSize: 27,
      total: 0
    }
  },

  mounted () {
    this.restdao = new RestDAO(this.ctx, 'danke/animation')
    this.loadMoreAnimation()
  },
  methods: {
    handleClick () {
      this.page = 0
      this.loadMoreAnimation()
    },
    async loadMoreAnimation () {
      const result = await this.restdao.list({
        page: this.page,
        count: this.pageSize,
        tags: this.animationType
      })
      this.total = result.total
      this.styles = result.list
      this.animations = result.list
      for (let animation of this.animations) {
        this.ctx.styleRegistry.addFrame(animation)
      }
    },
    // 鼠标移动上面之后会进行frame演示
    animationMouseEnter (animation) {
      const replayStore = animation.name
      animation.name = 'none'
      setTimeout(() => {
        animation.name = replayStore
      }, 300)
    },
    addAnimation(animation) {
      this.$emit('input', animation)
    }
  }
}
</script>

<style lang="scss">
#left-animation-tab {
  display: flex;
  flex-direction: column;
  .el-pagination {
    button, li {
      background: transparent;
      color: #eee;
      &.active {
        color: #00c4cc;
      }
      &:disabled {
        color: #596c7d;
      }
    }
  }
  .el-tabs {
    width: 100%;
    .el-tabs__header {
      margin-bottom: 5px;
    }
    .el-tabs__nav {
      margin-left: 10px;
    }
    .el-tabs__item {
      color: #eee;
      &.is-active {
        color: #00c4cc;
      }
    }
    .el-tabs__active-bar {
      background-color: #00c4cc;
    }
  }
  .animation-container {
    display: flex;
    flex-wrap: wrap;
    flex:1;
    overflow-y: auto;
  }
  .animation-item {
    width: 108px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 108px;
    overflow: hidden;
    position: relative;
    perspective: 200px;
    &:hover {
      background: rgba(0,0,0, .05);
      .animation-title {
        display: none;
      }
    }
    .animation-title {
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      text-align: center;
      font-size: 12px;
      color: #fff;
    }
    .preview-box {
      perspective: 200px;
      width: 60px;
      height: 60px;
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
      span {
        height: 60px;
        display: inline-block;
        line-height: 60px;
        font-size: 18px;
        width: 220px;
        margin-left: -75px;
        text-align: center;
      }
    }
    .preview-box.none {
      opacity: 0;
      transition: opacity .3s ease-in;
    }
  }
}


</style>
