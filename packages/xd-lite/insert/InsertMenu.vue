<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
    <van-grid :column-num="4" square>
      <van-grid-item icon="apps-o" text="矢量插图" @click="show = false; $emit('open', 'vector-album')" />
      <van-grid-item icon="description" text="文字" @click="show = false; $emit('open', 'text')" />
      <van-grid-item icon="photo-o" text="图片" @click="show = false; $emit('open', 'image')" />
      <van-grid-item icon="music-o" text="音乐" @click="show = false; $emit('open', 'music')" />
    </van-grid>
  </van-popup>
</template>

<script>
export default {
  name: "InsertMenu",
  data () {
    return {
      show: false
    }
  },
  methods: {
    open () {
      this.show = true
    }
  }
}
</script>

<style scoped>

</style>
