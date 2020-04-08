<template>
<div id="my-packs">
  <div class="content-title">
    <span>我的设计图库</span>
    <button class="small" @click="newPack">新增</button>
  </div>
  <div class="pack-container">
    <div class="pack" v-for="pack in packs" :key="pack._id" @click="openPack(pack._id)">
      {{pack.name}}
    </div>
  </div>

</div>
</template>

<script>
import { Dialog } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
export default {
  name: 'MyPacks',
  components: {
    [Dialog.name]: Dialog
  },
  data () {
    return {
      packs: [],
      dialogVisible: false
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
  },
  mounted () {
    this.loadMyPacks()
  },
  methods: {
    async loadMyPacks() {
      const result = await this.packdao.list()
      this.packs = result.list
    },
    async newPack () {
      const pack = await this.packdao.create({
        name: '图库'
      })
      this.$router.replace('/pack/' + pack.object._id)
    },
    openPack (id) {
      this.$router.push('pack/' + id)
    }
  }
}
</script>

<style lang="scss">
#my-packs {
  .content-title {
    button {
      margin-left: 20px;
    }
  }
}
</style>