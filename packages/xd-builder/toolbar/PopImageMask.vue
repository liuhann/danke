<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  title="选择裁切图案"
  width="360"
  @show="loadMaskVectors"
  trigger="click">
  <a class="action" slot="reference">
    <i class="el-icon-picture-outline-round"/>
  </a>
  <div class="clippath-list">
    <div class="pack" v-for="pack in maskPacks" :key="pack._id">
      <div class="pack-title">
        <div class="text">{{pack.name}}</div>
        <div class="more" @click="showPackVectors(pack)">查看全部</div>
      </div>
      <div class="pack-shapes">
        <div
          v-for="(vector, index) in pack.children" :key="index"
          class="object-item">
          <div class="svg-container" v-html="vector.content">
          </div>
        </div>
      </div>
    </div>
  </div>
</el-popover>
</template>

<script>
import { Popover } from 'element-ui'
import RestDAO from '../../common/dao/restdao'

export default {
  name: 'PopImageMask',
  components: {
    [Popover.name]: Popover
  },
  data () {
    return {
      publicPacks: [],
      myPacks: [],
    }
  },

  computed: {
    maskPacks () {
      return this.publicPacks.concat(this.myPacks)
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
  },
  methods: {
    async loadMaskVectors () {
      const result = await this.packdao.list({
        'type': 'vector',
        'system.public': 'on',
        'subcount': 3
      })
      this.publicPacks = result.list

      const mine = await this.packdao.list({
        'type': 'vector',
        'creator': this.ctx.user.id,
        'mask': true,
        'subcount': 3
      })
      this.myPacks = mine.list

    },

    showPackVectors () {

    }
  }
}
</script>

<style scoped lang="scss">
.clippath-list {
  display: flex;
  flex-wrap: wrap;
  .clippath {
    width: 75px;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 7px;
    &:hover {
      background-color: #efefef;
      cursor: pointer;
    }
    .container {
      width: 48px;
      height: 48px;
      background: #00bf72;
    }
  }
}
</style>
