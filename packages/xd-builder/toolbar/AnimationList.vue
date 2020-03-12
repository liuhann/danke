<template>
<div class="animation-list">
  <div v-for="(animation, index) in animations" :key="index"  class="animation-item"
       @mouseenter="animationMouseEnter(animation)"
       @click="addAnimation(animation)">
    <div class="preview-box" :class="animation.name">
      <img :src="CLOUD_HILL" />
    </div>
    <div class="animation-title">{{animation.title}}</div>
  </div>
  <pagination background :total="total" :page-size="pageSize" @current-change="loadAnimation" :current-page.sync="page" :pager-count="5" layout="prev, pager, next" />
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import { Pagination } from 'element-ui'
import CLOUD_HILL from '../../vectors/cloud-hill.webp'
export default {
  name: 'AnimationList',
  components: {
    Pagination
  },
  props: {
    type: {
      type: String
    }
  },
  data () {
    return {
      CLOUD_HILL,
      animations: [],
      page: 0,
      pageSize: 18,
      total: 0
    }
  },
  mounted () {
    this.restdao = new RestDAO(this.ctx, 'danke/animation')
    this.tabHeight = window.innerHeight - 150
    this.loadAnimation()
  },
  methods: {
    async loadAnimation () {
      const result = await this.restdao.list({
        page: this.page,
        count: this.pageSize,
        tags: this.type
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
  .animation-list {
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    .animation-item {
      width: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 100px;
      overflow: hidden;
      position: relative;
      background-image: linear-gradient(90deg, #592D2D, #592D2D);
      background-size: 60px 60px;
      background-position: center;
      background-repeat: no-repeat;
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
      }
      .preview-box.none {
        opacity: 0;
        transition: opacity .3s ease-in;
      }
    }
  }


</style>
