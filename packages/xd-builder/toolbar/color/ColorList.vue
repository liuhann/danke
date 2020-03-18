<template>
<div id="addon-color-list">
  <div class="color-container">
    <div class="addon-field">
      <span>选择颜色</span>
      <el-color-picker style="flex:1; margin-left: 10px;" v-model="currentColor" @change="selectColor" size="mini"></el-color-picker>
      <el-button type="text" @click="selectColor(null)">清除颜色</el-button>
    </div>
    <div class="default-colors" v-if="palette">
      <div class="color-block" v-for="c in palette" :key="c" @click="selectColor(c)" :style="{
        background: c
      }" />
    </div>
    <div class="addon-title">
       <span class="content">默认颜色</span>
    </div>
    <div class="default-colors">
      <div class="color-block" v-for="c in defaultColors" :title="c.split(' ')[0]" :key="c" @click="selectColor(c.split(' ')[1])" :style="{
        background: c.split(' ')[1]
      }" />
    </div>
    <div class="addon-title" v-if="mode === 'background'">
      <span class="content">颜色渐变</span>
      <a class="more" v-if="!gradientMore" @click="showMoreGradient">查看更多</a>
      <a class="more" v-if="gradientMore" @click="showLessGradient">收起</a>
    </div>
    <div class="gradient-colors" v-if="mode === 'background'">
      <div class="gradient-block" v-for="(g, index) in gradientColors" :key="index" :style="{
        background: `linear-gradient(${angle}deg, ${g[0]} 0%, ${g[1]} 100%)`
      }" @click="selectGradient(g)"/>
    </div>
  </div>
</div>
</template>

<script>
import { Popover, ColorPicker, Button } from 'element-ui'
import lights from './lights'
import darks from './darks'
import RestDAO from '../../../common/dao/restdao'

const defaultColors = ['黑色 #000000', '深灰色 #545454', '灰色 #737373', '灰色 #a6a6a6', '浅灰色 #d9d9d9', '白色 #ffffff', '亮红色 #ff1616', '珊瑚红色 #ff5757', '粉色 #ff66c4', '紫红色 #cb6ce6', '紫色 #8c52ff', '紫罗兰色 #5e17eb', '深宝石绿色 #03989e', '水蓝色 #00c2cb', '湖蓝色 #5ce1e6', '浅蓝色 #38b6ff', '宝蓝色 #5271ff', '深蓝色 #004aad', '绿色 #008037', '草绿色 #7ed957', '黄绿色 #c9e265', '黄色 #ffde59', '桃红色 #ffbd59', '橙色 #ff914d']

/**
 * 使用场景
 */
export default {
  name: 'ColorList',
  components: {
    [Popover.name]: Popover,
    [ColorPicker.name]: ColorPicker,
    [Button.name]: Button
  },
  props: {
    mode: {
      type: String,
      default: 'background'
    },
    color: {
      type: String
    },
    palette: {
      type: Array
    }
  },
  data () {
    return {
      colors: [],
      angle: 0,
      gradientColors: lights.slice(0, 4).concat(darks.slice(0, 4)),
      defaultColors,
      backgroundColors: [],
      gradientMore: false
    }
  },
  computed: {
    currentColor : {
      set (val) {
        this.selectColor(val)
      },
      get () {
        return this.color
      }
    }
  },
  created () {
    this.styledao = new RestDAO(this.ctx, 'danke/style')
  },
  mounted () {

  },
  methods: {
    selectColor (color) {
      this.$emit('input', color)
    },
    selectGradient  (g) {
      this.$emit('input', `linear-gradient(${this.angle}deg, ${g[0]} 0%, ${g[1]} 100%)`)
    },
    /**
     * set style to elements or scene itself
     * @param key
     * @param value
     */
    setStyle (key, value) {
      if (this.variable) {
        this.variable.value = value
      } else if (this.elements) {
        for (let element of this.elements) {
          if (value) {
            this.$set(element.style, key, value)
          } else {
            delete element.style[key]
          }
        }
      } else {
        if (value) {
          this.$set(this.scene.style, key, value)
        } else {
          delete this.scene.style[key]
        }
      }
    },

    setFontColor (value) {
      if (this.elements) {
        for (let element of this.elements) {
          if (element.style.font) {
            element.style.font.color = value
          }
        }
      }
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
  padding: 0 10px;
  overflow-y: auto;
  .addon-field {
    display: flex;
    align-items: center;
    line-height: 20px;
    font-weight: bold;
    font-size: 14px;
    color: rgba(14,19,24,.45);
  }
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
    &.clear {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==")
    }
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
