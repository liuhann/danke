<template>
  <van-grid :column-num="3">
    <van-grid-item icon="apps-o" text="矢量插图" @click="$emit('open', 'vector-album')" />
    <van-grid-item icon="description" text="文字" @click="$emit('open', 'text')" />
    <van-grid-item icon="photo-o" text="图片" @click="$emit('open', 'image')" />
    <van-grid-item icon="music-o" text="音乐" @click="$emit('open', 'music')" />
  </van-grid>
</template>

<script>
export default {
name: "InsertMenu"
}
</script>

<style scoped>

</style>