<template>
  <div id="my-blocks">
    <div class="content-title">
      我的图块
    </div>
    <div class="blocks-list-container">
      <div v-for="block in works" :key="block._id" class="list-item">
        <div class="work-container" :style="{
          background: block.color
        }"
        >
          <div class="work-viewport" :style="{
            width: block.viewport.width + 'px',
            height: block.viewport.height + 'px',
          }"
          >
            <render-scene :view-box="block.viewBox || block.screen" :scene="block.scenes[0]" :view-port="block.viewport" :stage="block.stage" />
          </div>
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
import { fitRectIntoBounds } from '../xd-builder/mixins/rectUtils'
import workListMixins from '../xd-builder/mixins/workListMixins'
import RenderScene from '../xd-builder/render/RenderScene'
import sleep from '../common/utils/sleep'
export default {
  name: 'MyBlocks',
  components: {
    RenderScene,
    [Dialog.name]: Dialog,
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  mixins: [ workListMixins ],
  data () {
    return {
      currentPage: 1,
      pageCount: 30,
      blocks: []
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'loadMyPacks'
  },
  created () { },
  mounted () {
    this.loadWorks()
  },
  methods: {
    listQuery () {
      return {
        creator: this.ctx.user.id,
        isBlock: 'yes'
      }
    },
    async fetchBlocks () {
      const result = await this.workdao.list({
        isBlock: true,
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
    editWork (work) {
      window.open('/xd?work=' + work.id)
    },

    async removeWork (work) {
      if (confirm('确认删除作品?')) {
        await this.workdao.delete(work)
        this.loadWorks()
      }
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
      cursor: pointer;
      margin: 10px;
      .work-container {
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .work-viewport {
        .scene {
          position: relative;
          overflow: hidden;
          .element {
            position: absolute;
          }
        }
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
