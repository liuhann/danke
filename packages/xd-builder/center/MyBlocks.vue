<template>
<div id="my-blocks">
  <div class="content-title">
    我的设计图片
  </div>
  <div class="blocks-list-container">
    <div class="block-item" v-for="block in blocks" :key="block._id">
      <render-scene :view-box="block.viewBox" :view-port="block.viewPort" :scene="block" stage="enter"/>
    </div>
  </div>
</div>
</template>

<script>
import { Dialog } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import { fitRectIntoBounds } from '../mixins/rectUtils'
import RenderScene from '../render/RenderScene'
export default {
  name: 'MyBlocks',
  components: {
    RenderScene,
    [Dialog.name]: Dialog,
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
        if (!block.viewBox) {
          block.viewBox = {
            width: 500,
            height: 200
          }
        }
        block.viewPort = fitRectIntoBounds(block.viewBox, {
          width: 160,
          height: 160
        })
      }
      this.blocks = result.list
    }
  }
}
</script>

<style lang="scss">
#my-blocks {
  .blocks-list-container {
    display: flex;
    flex-wrap: wrap;
    .block-item {
      border: 1px solid #efefef;
      border-radius: 10px;
      width: 160px;
      height: 160px;
      margin: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
  }
}
</style>
