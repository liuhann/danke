<template>
<div id="addon-color-list">
  <div class="color-container">
    <div class="addon-title">
      选择颜色
    </div>
    <div class="color-display" v-if="color == null || typeof color === 'string'">
      <div class="color-block" :style="{
        background: color
      }"></div>
    </div>
    <div class="color-display" v-if="color && typeof color === 'object'">
      <div class="color-block" v-for="c in color.colors" :key="c" :style="{
        background: c
      }">
      </div>
    </div>

    <div class="addon-title">
      默认颜色
    </div>
    <div class="default-colors">
      <div class="color-block" v-for="c in defaultColors" :title="c.split(' ')[0]" :key="c" @click="selectColor(c.split(' ')[1])" :style="{
        background: c.split(' ')[1]
      }" />
    </div>
    <div class="addon-title">
      <span class="content">渐变色</span>
      <span class="more">查看更多</span>
    </div>
    <div class="gradient-colors">
      <div class="color-block" v-for="g in gradientColors" :key="g.name" :class="g.name"/>
    </div>
    <div class="addon-title">
      深色渐变
    </div>
    <div class="lights-gradient">
    </div>
  </div>
</div>
</template>

<script>
import lights from './lights'
import RestDAO from '../../common/dao/restdao'

const defaultColors = ['黑色 #000000', '深灰色 #545454', '灰色 #737373', '灰色 #a6a6a6', '浅灰色 #d9d9d9', '白色 #ffffff', '亮红色 #ff1616', '珊瑚红色 #ff5757', '粉色 #ff66c4', '紫红色 #cb6ce6', '紫色 #8c52ff', '紫罗兰色 #5e17eb', '深宝石绿色 #03989e', '水蓝色 #00c2cb', '湖蓝色 #5ce1e6', '浅蓝色 #38b6ff', '宝蓝色 #5271ff', '深蓝色 #004aad', '绿色 #008037', '草绿色 #7ed957', '黄绿色 #c9e265', '黄色 #ffde59', '桃红色 #ffbd59', '橙色 #ff914d']
export default {
  name: 'AddonBackgroundList',
  props: {
    color: {
      type: [String, Object]
    }
  },
  data () {
    return {
      gradientColors: [],
      defaultColors,
      lights
    }
  },
  created () {
    this.styledao = new RestDAO(this.ctx, 'danke/style')
  },
  mounted () {
    this.loadGradientStyles()
  },
  methods: {
    selectColor (color) {
      this.$emit(' ', color)
    },
    async loadGradientStyles () {
      const result = await this.styledao.list({
        page: 0,
        count: 12,
        category: 'gradient'
      })
      this.gradientColors = result.list
      for (let style of result.list) {
        this.ctx.styleRegistry.addStyle(style)
      }
    }
  }

}
</script>

<style lang="scss">
#addon-color-list {
  padding: 16px;
  .addon-title {
    font-weight: bold;
    font-size: 14px;
    color: rgba(14,19,24,.45);
    .more {
      float: right;
      color: rgba(14,19,24,.6);
    }
  }

  .default-colors {
    padding: 12px 0;
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(6,1fr);
    grid-row-gap: 12px;
    grid-column-gap: 12px;
  }
  .color-block {
    border-radius: 4px;
    border: 1px solid #efefef;
    display: inline-block;
    width: 40px;
    height: 40px;
    &:hover, &.selected {
      cursor: pointer;
      transition: box-shadow .2s linear;
      border: none;
      box-shadow: 0 0 0 2px #00c4cc, inset 0 0 0 2px #fff;
      // box-shadow: inset 0 0 0 2px #fff;
    }
  }
}
</style>
