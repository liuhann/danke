<template>
<div id="addon-border-list">
  <div class="style-list" ref="styleList">
    <div class="style-prop-panel">
      <div class="variable-item" v-for="variable in borderVariables" :key="variable.name">
        <div class="var-number" v-if="variable.type === 'number'">
          <el-input-number v-model="variable.value" size="mini"/>
        </div>
        <div class="color-picker" v-if="variable.type === 'color'">
          <el-color-picker size="mini" v-model="variable.value"/>
        </div>
      </div>
    </div>
    <div class="style-item" :class="currentBorderName==null? 'current': ''">
      空白
    </div>
    <div v-for="(style, index) in styles" :key="index" class="style-item" :class="(currentBorderName === style.name)? 'current': ''" @click="useStyle(style, index)">
      <div class="style-container">
        <div class="styled-box" :class="style.name">
          <div class="inner"></div>
        </div>
      </div>
    </div>
  </div>

  <el-pagination background :total="total" :page-size="pageSize" @current-change="loadStyles" :current-page.sync="page" layout="prev, pager, next" />
</div>

</template>

<script>
import { Pagination, Button, Slider, ColorPicker, InputNumber } from 'element-ui'
import RestDAO from '../../utils/restdao.js'
export default {
  name: 'BorderList',
  components: {
    [Pagination.name]: Pagination,
    [Slider.name]: Slider,
    [Button.name]: Button,
    [ColorPicker.name]: ColorPicker,
    [InputNumber.name]: InputNumber
  },
  props: {
    elements: {
      type: Array
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
    borderVariables () {
      if (this.elements.length) {
        if (this.elements[0].style.border) {
          return this.elements[0].style.border.variables || []
        }
      }
      return []
    },
    currentBorderName () {
      if (this.elements.length) {
        if (this.elements[0].style.border) {
          return this.elements[0].style.border.name
        }
      }
      return null
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
        category: 'border',
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
      const currentStyle = style ? {
        name: style.name,
        variables: style.variables
      } : null
      for (let element of this.elements) {
        this.$set(element.style, 'border', currentStyle)
      }
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
    background: #fdfdfd;
    display: flex;
    flex-wrap: wrap;

    .el-input-number--mini {
      width: 92px;
    }
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
      width: 80px;
      margin: 0 6px 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 80px;
      &:nth-of-type(4) {
        margin-right: 0;
      }
      &:hover {
        background: rgba(0, 0, 0, .03);
      }
      &.current {
        background: rgba(0, 0, 0, .03);
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
