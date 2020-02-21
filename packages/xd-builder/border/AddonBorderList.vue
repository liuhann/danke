<template>
<div id="addon-border-list">
  <div class="style-list" ref="styleList">
    <div class="style-item" :class="border==null? 'current': ''">
      空白
    </div>
    <div v-for="(style, index) in styles" :key="index" class="style-item" :class="(border && border.name === style.name)? 'current': ''" @click="useStyle(style, index)">
      <div class="style-container">
        <div class="styled-box" :class="style.name">
          <div class="inner"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="style-prop-panel" ref="propPanel">
    <div class="variable-item" v-for="variable in borderVaraibles" :key="variable.name">
      <div class="var-number" v-if="variable.type === 'number'">
        <div class="var-label">{{variable.label}}</div>
        <div class="slider"><el-slider v-model="variable.value" :max="40" /></div>
        <div class="value">{{variable.value}}px</div>
      </div>
      <div class="color-picker" v-if="variable.type === 'color'">
        <div class="var-label">{{variable.label}}</div>
        <div class="picker">
          <el-color-picker size="mini" v-model="variable.value"/>
        </div>
      </div>
    </div>
  </div>
  <el-pagination background :total="total" :page-size="pageSize" @current-change="loadStyles" :current-page.sync="page" layout="prev, pager, next" />
</div>

</template>

<script>
import { Pagination, Button, Slider, ColorPicker } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
export default {
  name: 'AddonBorderList',
  components: {
    [Pagination.name]: Pagination,
    [Slider.name]: Slider,
    [Button.name]: Button,
    [ColorPicker.name]: ColorPicker
  },
  props: {
    border: {
      type: Object
    }
  },
  data () {
    return {
      variables: [],
      styles: [],
      page: 0,
      pageSize: 20,
      total: 0
    }
  },
  created () {
    this.styledao = new RestDAO(this.ctx, 'danke/style')
  },
  computed: {
    borderVaraibles () {
      if (this.border) {
        return this.border.variables || []
      } else {
        return []
      }
    }
  },
  mounted () {
    this.loadStyles()
  },
  methods: {

    /**
     * 分页加载样式，并写入到全局注册
     */
    async loadStyles () {
      const result = await this.styledao.list({
        page: this.page,
        count: this.pageSize
      })
      this.total = result.total
      this.styles = result.list
      try {
        for (let style of result.list) {
          this.ctx.styleRegistry.addStyle(style)
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 使用样式
    useStyle (style, index) {
      debugger
      this.currentStyle = style ? {
        name: style.name,
        variables: style.variables
      } : null
      this.$emit('input', this.currentStyle)
      const list = this.$refs.styleList
      // 插入样式面板到当前之下
      list.insertBefore(this.$refs.propPanel, list.childNodes[Math.floor((index + 1) / 4) * 4 + 4])
    }
  }
}
</script>
<style lang="scss">
#addon-border-list {
  padding: 10px;
  // 属性配置面板
  .style-prop-panel {
    width: 100%;
    margin: 8px 0;
    box-shadow: inset 0 0 2px #eee;
    background: #fdfdfd;
    .variable-item {
      font-size: 12px;
      padding: 6px;
      .var-number {
        display: flex;
        line-height: 36px;
        .var-label {
          width: 64px;
        }
        .slider {
          margin: 0 10px;
          flex: 1;
          display: flex;
          align-items: center;
          >div {
            flex: 1;
          }
        }
        .value {
          width: 36px;
        }
      }
      .color-picker {
        display: flex;
        line-height: 36px;
        .var-label {
          width: 64px;
        }
        .picker {
          flex: 1;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .style-list {
    display: flex;
    flex-wrap: wrap;
    .style-item {
      width: 25%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 80px;
      &:hover {
        box-shadow: inset 0 0 0 1px #00c5cc86;
      }
      &.current {
        box-shadow: inset 0 0 0 1px #00c5cc86;
      }
    }
    .style-container {
      display: flex;
      align-items: center;
      justify-content: center;
      .styled-box {
        width: 52px;
        height: 52px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        z-index: 10;
        position: relative;
        > div.inner {
          position: absolute;
          z-index: 10;
          width: 100%;
          height: 100%;
          background-color: rgba(255,255,255, .6)
        }
      }
    }
}
}
</style>
