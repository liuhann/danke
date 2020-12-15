<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '100%' }">
    <van-nav-bar>
      <template #right>
        <van-icon name="close" size="20" @click="show = false" />
      </template>
      <template #left>
        插入元素
      </template>
    </van-nav-bar>
    <div class="grid-title">基础素材</div>
    <van-grid :column-num="4" square :icon-size="40">
      <van-grid-item icon="photo-o" text="图片" @click="$emit('open', 'uploads')" />
      <van-grid-item icon="photo-o" text="文字" @click="$emit('open', 'text')" />
      <van-grid-item icon="points" text="常用形状" @click="$emit('open', 'vectors', '5fc750e1922370cef95fa314')" />
      <van-grid-item icon="bag-o" text="常用图标" @click="$emit('open', 'vectors', '5fc7261c922370cef95fa26d')" />
      <van-grid-item icon="photo-o" text="浅色渐变背景" @click="$emit('open', 'vectors', '5fd33697922370cef95fa33f')" />
      <van-grid-item icon="photo-o" text="深色渐变背景" @click="$emit('open', 'vectors', '5fd6fa3a922370cef95fa39a')" />
    </van-grid>

    <div class="vector-albums">
      <div class="grid-title">卡通头像素材</div>
      <van-grid clickable square :icon-size="48">
        <van-grid-item v-for="(pack, index) in vectorAvatarPacks" :key="index" :icon="getImageUrl(pack.previews[0]) || 'image-o'"
                       :text="pack.name" @click="$emit('open','vectors', pack._id)"
        />
      </van-grid>
    </div>

    <div class="photo-albums">
      <div class="grid-title">风景与摄影图片</div>
      <van-grid clickable square :icon-size="48">
        <van-grid-item icon="photo-o" text="风景图片-天空" @click="$emit('open','unsplash', 'sky', '风景图片-天空')" />
        <van-grid-item icon="photo-o" text="风景图片-高山" @click="$emit('open','unsplash', 'moutains', '风景图片-高山')" />
        <van-grid-item icon="photo-o" text="热气球" @click="$emit('open','unsplash', 'hot balloon', '风景图片-热气球')" />
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
.grid-title {
  margin: 0;
  padding: 16px;
  color: rgba(69, 90, 100, 0.6);
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
}
</style>
