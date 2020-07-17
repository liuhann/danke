<template>
  <div id="addon-html-list">
    <div class="left-block">
      <div class="block-title">
        <div class="text">
          常用形状
        </div>
      </div>
      <div class="block-list">
        <div
          v-for="(shape, index) in shapes"
          :key="index"
          class="object-item" draggable @dragstart="dragStart(shape, $event)"
        >
          <div class="shape" :style="shapeStyle(shape)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { assignVariables} from '../mixins/renderUtils'
import { Pagination, Input, Button, Loading, Checkbox } from 'element-ui'
import RestDAO from '../../utils/restdao.js'
import shapes from './shapes'

export default {
  name: 'HtmlElementList',
  components: {
    [Input.name]: Input,
    [Pagination.name]: Pagination,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button
  },
  mixins: [  ],
  data () {
    return {
      shapes,
      searchValue: '',
    }
  },
  created () {
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
  },
  mounted () {
  },
  methods: {
     shapeStyle (shape) {
      const style = Object.assign({}, shape.style)
      assignVariables(style, shape.variables)
      return style
    },

    dragStart (shape, ev) {
      ev.dataTransfer.setData('Text', JSON.stringify(shape))
    }
  }
}
</script>

<style lang="scss">
@import './common.scss';
#addon-html-list {
  .search-box {
    margin: 10px;
    input {
      &:hover {
        box-shadow: none;
      }
    }
  }
  .pack {
    .pack-title {
      padding: 10px;
      display: flex;
      font-size: 1.5rem;
      .text {
        flex: 1;
        font-weight: bold;
        color: #fff;
      }
      .more {
        color: #99a9bf;
        cursor: pointer;
        &:hover {
          color: rgba(153, 169, 191, 0.6);
        }
      }
    }
  }
  .pack-shapes {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .object-item {
      width: 100px;
      height: 100px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      &.add {
        border: 1px dashed #99a9bf;
        margin-left: 10px;
        width: 80px;
        height: 80px;
        cursor: pointer;
        i {
          font-size: 20px;
          color: #99a9bf;
        }
      }
      &:nth-of-type(3n) {
        margin-right: 0;
      }
      .svg-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          width: 100%;
          height: 100%;
        }
      }
      .shape-name {
        position: absolute;
        bottom: -16px;
        color: #eee;
      }
      .shape {
        transform: scale(.8);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #fff;
      }
    }
  }
}
</style>
