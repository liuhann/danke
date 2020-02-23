<template>
<div id="addon-color-list">
  <div class="color-container">
    <div class="addon-title">
      默认颜色
    </div>
    <div class="default-colors">
      <div class="color-block" v-for="c in defaultColors" :title="c.split(' ')[0]" :key="c" @click="selectColor(c.split(' ')[1])" :style="{
        background: c.split(' ')[1]
      }" />
    </div>
    <div class="addon-title">
      <span class="content">颜色渐变</span>
      <el-popover
        placement="top-start"
        width="160"
        trigger="click">
        <div class="angle-switcher">
          <div class="pop-title">调整角度</div>
          <circle-slider class="switcher" :max="360" :side="100" v-model="angle" />
          <div class="angle">{{ angle }}度</div>
        </div>
        <i slot="reference" class="el-icon-setting" />
      </el-popover>
      <a class="more" v-if="!gradientMore" @click="showMoreGradient">查看更多</a>
      <a class="more" v-if="gradientMore" @click="showLessGradient">收起</a>
    </div>
    <div class="gradient-colors">
      <div class="gradient-block" v-for="(g, index) in gradientColors" :key="index" :style="{
        background: `linear-gradient(${angle}deg, ${g[0]} 0%, ${g[1]} 100%)`
      }" @click="selectGradient(g)"/>
    </div>
    <div class="addon-title">
      <span class="content">多重渐变</span>
    </div>
    <div class="background-colors">
      <div class="background-block" v-for="(bg, index) in backgroundColors" :key="index" :class="bg.name" @click="selectBackground(bg)"/>
    </div>
  </div>
</div>
</template>

<script>
import VueCircleSlider from 'vue-circle-slider'
import { Popover } from 'element-ui'
import lights from './lights'
import darks from './darks'
import RestDAO from '../../common/dao/restdao'

const defaultColors = ['黑色 #000000', '深灰色 #545454', '灰色 #737373', '灰色 #a6a6a6', '浅灰色 #d9d9d9', '白色 #ffffff', '亮红色 #ff1616', '珊瑚红色 #ff5757', '粉色 #ff66c4', '紫红色 #cb6ce6', '紫色 #8c52ff', '紫罗兰色 #5e17eb', '深宝石绿色 #03989e', '水蓝色 #00c2cb', '湖蓝色 #5ce1e6', '浅蓝色 #38b6ff', '宝蓝色 #5271ff', '深蓝色 #004aad', '绿色 #008037', '草绿色 #7ed957', '黄绿色 #c9e265', '黄色 #ffde59', '桃红色 #ffbd59', '橙色 #ff914d']
export default {
  name: 'AddonBackgroundList',
  components: {
    [Popover.name]: Popover
  },
  props: {
    color: {
      type: [String, Object]
    }
  },
  data () {
    return {
      currentGradient: null,
      angle: 0,
      gradientColors: lights.slice(0, 4).concat(darks.slice(0, 4)),
      defaultColors,
      backgroundColors: [],
      gradientMore: false
    }
  },
  created () {
    this.styledao = new RestDAO(this.ctx, 'danke/style')
  },
  mounted () {
    this.loadBackgrounds()
  },
  methods: {
    selectColor (color) {
      this.$emit('input', {
        backgroundColor: color
      })
      this.$emit('color', color)
    },
    selectGradient  (g) {
      this.$emit('input', {
        background: `linear-gradient(${this.angle}deg, ${g[0]} 0%, ${g[1]} 100%)`
      })
      this.$emit('color', g)
    },

    selectBackground (bg) {
      this.$emit('input', {
        name: bg.name
      })
    },

    showMoreGradient () {
      this.gradientMore = true
      this.gradientColors = lights.concat(darks)
    },

    showLessGradient () {
      this.gradientMore = false
      this.gradientColors = lights.slice(0, 4).concat(darks.slice(0, 4))
    },

    async loadBackgrounds () {
      const result = await this.styledao.list({
        page: 0,
        count: 12,
        category: 'background'
      })
      this.backgroundColors = result.list
      for (let style of result.list) {
        this.ctx.styleRegistry.addStyle(style)
      }
    }
  }

}
</script>

<style lang="scss">
.angle-switcher  {
  .angle {
    position: absolute;
    top: 90px;
    left: 51px;
    width: 61px;
    text-align: center;
  }
  .switcher {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 141px;
  }
}

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
    .el-icon-setting {
      padding-left: 5px;
      cursor: pointer;
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
  .gradient-colors, .background-colors {
    padding: 12px 0;
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(4,1fr);
    grid-row-gap: 12px;
    grid-column-gap: 12px;
  }
  .gradient-block, .background-block {
    border-radius: 4px;
    border: 1px solid #efefef;
    display: inline-block;
    width: 70px;
    height: 50px;
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
