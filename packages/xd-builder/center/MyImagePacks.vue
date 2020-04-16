<template>
<div id="my-image-packs">
  <div class="content-title">
    图片库
  </div>
  <div class="pack-container vector">
    <div class="pack add">
      <i class="el-icon-plus" @click="newPack"/>
    </div>
    <div class="pack" v-for="pack in packs" :key="pack._id" @click="openPack(pack._id)">
      <icon-folder />
      <div v-if="pack.shared" class="shared">已分享</div>
      <div class="pack-meta">
        <div class="name">
          {{pack.name}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Dialog } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import IconFolder from './photo.svg'
export default {
  name: 'MyPacks',
  components: {
    [Dialog.name]: Dialog,
    IconFolder
  },
  data () {
    return {
      type: 'images',
      packs: []
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
  },
  mounted () {
    this.loadMyPacks()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'loadMyPacks'
  },
  methods: {
    async loadMyPacks() {
      const result = await this.packdao.list({
        type: this.type,
        subcount: 4,
        creator: this.ctx.user.id,
      })
      this.packs = result.list
    },
    async newPack () {
      const pack = await this.packdao.create({
        type: this.type,
        name: '图片库'
      })
      this.$router.push('pack/' + pack.object._id)
    },
    openPack (id) {
      this.$router.push('pack/' + id)
    }
  }
}
</script>

<style lang="scss">
#my-image-packs {
  .pack-container {
    display: flex;
    flex-wrap: wrap;
    .pack {
      width: 120px;
      height: 140px;
      margin: 12px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      .shared {
        position: absolute;
        right: -45px;
        top: -10px;
        background-color: #00bf72;
        color: #fff;
        padding: 20px 40px 3px;
        transform: rotate(40deg);
      }
      &.add {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
        color: var(--mainColor);
      }
      svg {
        margin: 10px 10px 0;
        width: 100px;
        height: 100px;
      }
      .pack-meta {
        padding: 5px;
        text-align: center;
      }
    }
  }
}
</style>