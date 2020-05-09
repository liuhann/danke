<template>
<div id="addon-block-list">
    <div class="search-box">
      <el-input placeholder="搜索素材库" v-model="searchValue" class="input-with-select" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="block-list-container">
      <div
        v-for="(block, index) in blocks"
        :key="index"
        class="block" draggable @dragstart="dragStart(block, $event)">
        <render-scene :scene="block" :view-port="block.viewPort" :view-box="block.viewBox" stage="enter"/>
      </div>
    </div>
</div>
</template>

<script>
import { Pagination, Input, Button, Loading } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import RenderScene from '../render/RenderScene'
import { fitRectIntoBounds } from '../mixins/rectUtils'

export default {
  name: 'LeftBlockList',
  mixins: [  ],
  components: {
    RenderScene,
    [Input.name]: Input,
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  data () {
    return {
      searchValue: '',
      currentPage: 1,
      pageCount: 30,
      blocks: [],
    }
  },
  created () {
    this.blockdao = new RestDAO(this.ctx, 'danke/block')
  },
  mounted () {
    this.fetchBlocks()
  },
  methods: {
    dragStart (block, ev) {
      ev.dataTransfer.setData('Text', JSON.stringify(block))
    },
    async fetchBlocks () {
      const result = await this.blockdao.list({
        page: this.currentPage,
        count: this.pageCount
      })
      for (let block of result.list) {
        block.viewPort = fitRectIntoBounds(block.viewBox, {
          width: 140,
          height: 140
        })
      }
      this.blocks = result.list
    },
  }
}
</script>

<style lang="scss">
#addon-block-list {
  .search-box {
    .el-input {
      background: transparent;
      border: none;

      .el-input-group__append {
        background: #545961;
        border: none;
      }
    }
    margin: 10px;
    input {
      background: rgba(255, 255, 255,.1);
      border: none;
      color: #ddd;
      &:hover {
        box-shadow: none;
      }
    }
  }
  .block-list-container {
    display: flex;
    flex-wrap: wrap;
    .block {
      justify-content: center;
      align-items: center;
      width: 148px;
      height: 148px;
      padding: 8px;
      display: flex;
    }
  }
}
</style>
