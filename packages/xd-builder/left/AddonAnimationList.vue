<template>
<div id="addon-animation-list">
  <div class="animation-list">
    <div v-for="(animation, index) in animations" :key="index" class="animation-item"
      @mouseover="animationMouseOver(animation)"
      @click="addAnimation(animation)">
      <div class="preview-box" :class="animation.name">
      </div>
    </div>
  </div>
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import { addAnimationStyle, createSheet } from '../../frames/keyframe'
export default {
  name: 'AddonAnimationList',
  data () {
    return {
      hoverAnimation: null,
      animations: [],
      page: 0,
      pageSize: 20,
      total: 0
    }
  },
  created () {},
  mounted () {
    this.sheet = createSheet()
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
        addAnimationStyle(this.sheet, animation)
      }
    },

    animationMouseOver (animation) {
      animation.name = ''
      this.$$nextTick(() => {
        this.hoverAnimation = animation.name
      })
    }
  }
}
</script>

<style lang="scss">
#addon-animation-list {
  .animation-list {
    display: flex;
    flex-wrap: wrap;
    .animation-item {
      width: 25%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 80px;
      .preview-box {
         background: #00c7ae;
         width: 32px;
         height: 32px;
      }
    }
  }
}
</style>
