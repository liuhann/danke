<template>
<div id="my-blocks">
  <div class="content-title">
    我的设计图片
  </div>
  <div class="blocks-list-container">
    <div class="list-item" v-for="block in blocks" :key="block._id">
      <div class="block">
        <render-scene :view-box="block.viewBox" :view-port="block.viewPort" :scene="block" :stage="block.stage"/>
      </div>
      <el-dropdown size="small" trigger="click" @command="(command) => handleCommand(command, block)">
        <span class="el-dropdown-link">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="replay">重新播放</el-dropdown-item>
          <el-dropdown-item command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</div>
</template>

<script>
import { Dialog, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import { fitRectIntoBounds } from '../mixins/rectUtils'
import RenderScene from '../render/RenderScene'
import sleep from '../../common/utils/sleep'
export default {
  name: 'MyBlocks',
  components: {
    RenderScene,
    [Dialog.name]: Dialog,
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  data () {
    return {
      currentPage: 1,
      pageCount: 30,
      blocks: []
    }
  },
  created () {
    this.blockdao = new RestDAO(this.ctx, 'danke/block')
  },
  mounted () {
    this.fetchBlocks()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'loadMyPacks'
  },
  methods: {
    async fetchBlocks () {
      const result = await this.blockdao.list({
        page: this.currentPage,
        count: this.pageCount
      })
      for (let block of result.list) {
        block.stage = 'enter'
        block.viewPort = fitRectIntoBounds(block.viewBox, {
          width: 160,
          height: 160
        })
      }
      this.blocks = result.list
    },

    async handleCommand (command, block) {
      switch (command) {
        case 'delete':
          await this.removeBlock(block)
          break;
        case 'replay':
          await this.replay(block)
          break;
        default:
          break;
      }
    },

    async replay (block) {
      block.stage = 'exist'
      await sleep(500)
      block.stage = 'enter'
    },
    async removeBlock (block) {
      await this.blockdao.delete(block)
      await this.fetchBlocks()
    }
  }
}
</script>

<style lang="scss">
#my-blocks {
  .blocks-list-container {
    display: flex;
    flex-wrap: wrap;
    .list-item {
      position: relative;
      border: 1px solid #efefef;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      margin: 10px;
      .block {
        width: 160px;
        height: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-dropdown {
        display: none;
        position: absolute;
        right: 10px;
        top: 10px;
      }
      &:hover {
        .el-dropdown {
          display: initial;
        }
      }
    }
  }
}
</style>
