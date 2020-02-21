<template>
<div id="addon-animation-list">
  <div class="addon-title">
    添加动画
  </div>
  <div class="animation-list">
    <div v-for="(animation, index) in animations" :key="index" class="animation-item"
      @mouseenter="animationMouseEnter(animation)"
      @click="addAnimation(animation)">
      <div class="preview-box" :class="animation.name">
        <img :src="SVG" />
      </div>
      <div class="animation-title">{{animation.title}}</div>
    </div>
  </div>
  <el-pagination background :total="total" :page-size="pageSize" @current-change="loadAnimation" :current-page.sync="page" layout="prev, pager, next" />
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import SVG from './project.svg'
import { Pagination } from 'element-ui'
export default {
  name: 'AddonAnimationList',
  components: {
    [Pagination.name]: Pagination
  },
  data () {
    return {
      SVG,
      hoverAnimation: null,
      animations: [],
      page: 0,
      pageSize: 30,
      total: 0
    }
  },
  created () {},
  mounted () {
    this.restdao = new RestDAO(this.ctx, 'danke/animation')
    this.loadAnimation()
  },
  methods: {
    async loadAnimation () {
      const result = await this.restdao.list({
        page: this.page,
        count: this.pageSize
      })
      this.total = result.total
      this.styles = result.list
      this.animations = result.list
      for (let animation of this.animations) {
        this.ctx.styleRegistry.addFrame(animation)
      }
    },

    // 增加动画
    addAnimation (animation) {
      this.$emit('add', {
        // 名称，供配置展示用
        title: animation.title,
        // css类名称
        name: animation.name,
        // 过渡函数，默认不许修改
        timing: animation.timing,
        // 时间区间 [0]为延迟，[1]为持续时间
        range: [0, parseInt(animation.duration)]
      })
    },

    // 鼠标移动上面之后会进行frame演示
    animationMouseEnter (animation) {
      const replayStore = animation.name
      animation.name = 'none'
      setTimeout(() => {
        animation.name = replayStore
      }, 300)
    }
  }
}
</script>

<style lang="scss">
#addon-animation-list {
  .addon-title {
    font-size: 16px;
    padding: 10px 20px;
    border-bottom: 1px solid seashell;
  }
  .animation-list {
    display: flex;
    flex-wrap: wrap;
    .animation-item {
      width: 33.3%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 120px;
      overflow: hidden;
      position: relative;
      background-image: linear-gradient(90deg, #592D2D, #592D2D);
      background-size: 60px 60px;
      background-position: center;
      background-repeat: no-repeat;

      perspective: 200px;
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
      }
      .preview-box.none {
        opacity: 0;
        transition: opacity .3s ease-in;
      }
    }
  }
}
</style>
