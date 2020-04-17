<template>
<div id="addon-shape-list">
  <div class="search-box">
    <el-input placeholder="搜索素材库" v-model="searchValue" class="input-with-select" clearable>
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
  </div>
  <div class="pack">
    <div class="pack-title">
      <div class="text">常用形状</div>
      <div class="more" @click="showMoreShapes">查看全部</div>
    </div>
    <div class="pack-shapes">
      <div
        v-for="(shape, index) in shapes.slice(0, 3)"
        :key="index"
        class="object-item" draggable @dragstart="dragStart(shape, $event)">
        <div class="shape" :style="shapeStyle(shape)"></div>
      </div>
    </div>
  </div>
  <div class="pack" v-for="pack in myPacks" :key="pack._id">
    <div class="pack-title">
      <div class="text">{{pack.name}}</div>
      <div class="more" @click="showPackVectors(pack)">查看全部</div>
    </div>
    <div class="pack-shapes">
      <div
        v-for="(vector, index) in pack.children" :key="index"
        class="object-item" draggable @dragstart="dragStart(vector, $event)">
        <div class="svg-container" :style="vectorVariables(vector)" v-html="vector.content">
        </div>
      </div>
    </div>
  </div>

  <div class="pack-listing">
  </div>
</div>
</template>

<script>
import shapes from './shapes'
import { assignVariables} from '../mixins/renderUtils'
import { Pagination, Input, Button } from 'element-ui'
import RestDAO from '../../common/dao/restdao'

export default {
  name: 'LeftShapeList',
  mixins: [  ],
  components: {
    [Input.name]: Input,
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  data () {
    return {
      myPacks: [],
      shapes,
      searchValue: '',
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
  },
  mounted () {
    this.fetchMyPacks()
    this.fetchSharedPacks()
  },
  methods: {
    async fetchMyPacks () {
      const result = await this.packdao.list({
        type: 'vector',
        creator: this.ctx.user.id,
        subcount: 3
      })
      this.myPacks = result.list
    },
    async fetchSharedPacks () {

    },
    async searchPacks () {

    },

    showPackVectors () {

    },
    dragStart (object, ev) {
      // stringify image info as text
      ev.dataTransfer.setData('Text', JSON.stringify(object))
      this.draggingImage = true
    },

    showMoreShapes () {

    },

    vectorVariables (vector) {
      const style = {}
      assignVariables(style, vector.variables)
      return style
    },

    shapeStyle (shape) {
      const style = Object.assign({}, shape.style)
      assignVariables(style, shape.variables)
      style.width = shape.width + 'px'
      style.height = shape.height + 'px'
      return style
    },
    // load list callback
    objectUpdated () {
      for (let object of this.objects) {
        this.ctx.styleRegistry.addVector(object)
      }
    },
    dragEnd () {
      this.draggingImage = false
    }
  }
}
</script>

<style lang="scss">
#addon-shape-list {
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
  .shape-list {
    display: flex;
    flex-wrap: wrap;
    .object-item {
      width: 98px;
      height: 100px;
      margin-bottom: 20px;
      margin-right: 20px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>
