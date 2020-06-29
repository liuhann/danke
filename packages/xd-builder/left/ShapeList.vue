<template>
  <div id="addon-shape-list">
    <template v-if="!packTitle">
      <div class="search-box">
        <el-input v-model="searchValue" placeholder="搜索素材库" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </div>
      <div class="pack">
        <div class="pack-title">
          <div class="text">
            常用形状
          </div>
          <div class="more" @click="showMoreShapes">
            查看全部
          </div>
        </div>
        <div class="pack-shapes">
          <div
            v-for="(shape, index) in shapes.slice(0, 3)"
            :key="index"
            class="object-item" draggable @dragstart="dragStart(shape, $event)"
          >
            <div class="shape" :style="shapeStyle(shape)" />
            <div class="shape-name">
              {{ shape.name }}
            </div>
          </div>
        </div>
      </div>
      <div v-for="pack in myPacks" :key="pack._id" class="pack">
        <div class="pack-title">
          <div class="text">
            {{ pack.name }}
          </div>
          <div class="more" @click="showPackVectors(pack)">
            查看全部
          </div>
        </div>
        <div class="pack-shapes">
          <div
            v-for="(vector, index) in pack.children" :key="index"
            class="object-item" draggable @dragstart="dragStart(vector, $event)"
          >
            <div class="svg-container" :style="vectorVariables(vector)" v-html="vector.content" />
          </div>
        </div>
      </div>
    </template>

    <div class="pack-listing pack">
      <div class="pack-title">
        <div class="text">
          {{ currentPack.name }}
        </div>
        <div class="is-mask">
          <el-checkbox v-model="packIsMask" @change="setPackMasktable">
            遮罩
          </el-checkbox>
        </div>
        <div class="more" @click="closePackList">
          关闭
        </div>
      </div>
      <div class="pack-shapes">
        <div
          v-for="(shape, index) in packResources"
          :key="index"
          class="object-item" draggable @dragstart="dragStart(shape, $event)"
        >
          <div v-if="!shape._id" class="shape" :style="shapeStyle(shape)" />
          <div v-if="!shape._id" class="shape-name">
            {{ shape.name }}
          </div>
          <div v-else class="svg-container" :style="vectorVariables(shape)" v-html="shape.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { assignVariables} from '../mixins/renderUtils'
import { Pagination, Input, Button, Loading, Checkbox } from 'element-ui'
import RestDAO from '../../utils/restdao.js'

export default {
  name: 'LeftShapeList',
  components: {
    [Input.name]: Input,
    [Pagination.name]: Pagination,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button
  },
  mixins: [  ],
  data () {
    return {
      myPacks: [],
      shapes: [],
      currentPack: null,
      packTitle: '',
      packIsMask: false,
      packResources: [],
      packPageCount: 30,
      packPageCurrent: 1,
      packPageTotal: 0,
      searchValue: '',
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
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
    showMoreShapes () {
      this.packTitle = '基本形状'
      this.packResources = shapes
    },

    closePackList () {
      this.packTitle = ''
      this.packResources = []
    },

    async fetchSharedPacks () {

    },
    async searchPacks () {

    },

    insert (element) {
      this.$emit('insert', element)
    },

    setPackMasktable (val) {
      this.packdao.patch(this.currentPack._id, {
        mask: val
      })
    },

    async showPackVectors (pack) {
      this.currentPack = pack
      this.packTitle = pack.name
      this.packResources = pack.children
      this.packIsMask = pack.mask
      const instance = Loading.service({
        target: '#addon-shape-list'
      })
      const result = await this.svgdao.list({
        pack: pack._id,
        count: 100
      })
      this.packResources = result.list
      instance.close()
    },
    dragStart (object, ev) {
      // stringify image info as text
      ev.dataTransfer.setData('Text', JSON.stringify(object))
      this.draggingImage = true
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
