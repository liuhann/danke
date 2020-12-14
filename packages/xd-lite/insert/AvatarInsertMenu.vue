<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '60%' }">
    <van-divider content-position="center">基础素材</van-divider>
    <van-grid :column-num="4" square :icon-size="40">
      <van-grid-item icon="photo-o" text="我的图片" @click="show = false; $emit('open', 'image')" />
      <van-grid-item icon="points" text="常用形状" @click="show = false; $emit('open', 'vectors', '5fc750e1922370cef95fa314')" />
      <van-grid-item icon="photo-o" text="浅色渐变背景" @click="$emit('open', 'vectors', '5fd33697922370cef95fa33f')" />
      <van-grid-item icon="photo-o" text="深色渐变背景" @click="$emit('open', 'vectors', '5fd6fa3a922370cef95fa39a')" />
    </van-grid>

    <div class="vector-albums">
      <van-divider content-position="center">卡通头像素材</van-divider>
      <van-grid clickable square :icon-size="48">
        <van-grid-item v-for="(pack, index) in vectorAvatarPacks" :key="index" :icon="getImageUrl(pack.previews[0]) || 'image-o'"
                       :text="pack.name" @click="$emit('open','vectors', pack._id)"
        />
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
import RestDAO from '../../utils/restdao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
export default {
  name: "AvatarInsertMenu",
  data () {
    return {
      show: false,
      vectorAvatarPacks: []
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
  },
  mounted () {
    this.onMouted()
  },
  methods: {
    getImageUrl,
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },

    async onMouted () {
      const result = await this.packdao.list({
        tags: 'avatar',
        page: this.currentPage,
        count: this.pageCount
      })
      this.vectorAvatarPacks = result.list
    }
  }
}
</script>

<style scoped>

</style>
