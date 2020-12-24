<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '100%' }">
    <van-nav-bar>
      <template #right>
        <van-icon name="cross" size="22" @click="show = false" />
      </template>
      <template #left>
        <bold>插入元素 </bold>
      </template>
    </van-nav-bar>
    <div class="grid-title">基础素材</div>
    <van-grid :column-num="4" square :icon-size="40">
      <van-grid-item icon="photo-o" text="图片" @click="$emit('open', 'uploads')" />
      <van-grid-item icon="notes-o" text="文字" @click="$emit('open', 'text')" />
    </van-grid>

    <div class="vector-albums">
      <div class="grid-title">矢量图片</div>
      <van-grid clickable square :icon-size="48">
        <van-grid-item v-for="(pack, index) in vectorBasicPacks" :key="index" :icon="getImageUrl(pack.previews[0]) || 'image-o'"
                       :text="pack.name" @click="$emit('open','vectors', pack._id)"
        />
      </van-grid>
    </div>

    <div class="vector-albums">
      <div class="grid-title">卡通素材</div>
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
      vectorBasicPacks: [],
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
      this.vectorAvatarPacks = (await this.packdao.list({
        tags: 'avatar',
        page: 1,
        count: 8
      })).list

      this.vectorBasicPacks = (await this.packdao.list({
        tags: 'basic',
        page: 1,
        count: 8
      })).list
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
