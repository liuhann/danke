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
        <render-scene :scene="block" :view-port="block.viewPort" :view-box="block.viewBox" stage="in"/>
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
    async fetchBlocks () {
      const result = await this.blockdao.list({
        page: this.currentPage,
        count: this.pageCount
      })
      for (let block of result.list) {
        if (block.viewBox) {
          block.viewBox = {
            width: 500,
            height: 200
          }
        }
        block.viewPort = fitRectIntoBounds(block.viewBox, {
          width: 120,
          height: 120
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
}
</style>
