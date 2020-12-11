<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '60%' }">
    <van-grid :column-num="4" square>
      <van-grid-item icon="photo-o" text="我的图片" @click="show = false; $emit('open', 'image')" />
      <van-grid-item icon="photo-o" text="头像装饰模板" @click="show = false; $emit('open', 'image')" />
    </van-grid>

    <div class="vector-albums">
      <div>头像素材</div>
      <van-grid clickable square :icon-size="32">
        <van-grid-item v-for="(pack, index) in vectorAvatarPacks" :key="index" :icon="getImageUrl(pack.previews[0]) || 'image-o'"
                       :text="pack.name" @click="$emit('open', pack)"
        />
      </van-grid>
    </div>
    <div class="vector-albums">
      <div>图集</div>
      <van-grid clickable square :icon-size="32">
        <van-grid-item v-for="(pack, index) in vectorAvatarPacks" :key="index" :icon="getImageUrl(pack.previews[0]) || 'image-o'"
                       :text="pack.name" @click="$emit('open', pack)"
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
