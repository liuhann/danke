<template>
  <van-tabs v-model="elementCollapseName" class="tabs-select-element">
    <van-tab title="基本元素">
      <van-cell title="图片" icon="photo" :clickable="true" label="可选择图片、设置形状及背景" @click="choose('image')"/>
      <van-cell title="文字" icon="edit" :clickable="true" label="可编辑的文字" @click="choose('text')"/>
      <van-cell title="视频" icon="edit" :clickable="true" label="可选择视频内容，设置播放时间" @click="choose('video')"/>
      <van-cell title="音频" icon="edit" :clickable="true" label="可选择音频内容，设置播放时间" @click="choose('video')"/>
      <van-cell title="集成的图层" icon="edit" :clickable="true" label="可选择音频内容，设置播放时间" @click="choose('video')"/>
    </van-tab>
  </van-tabs>
</template>

<script>
const URLS = {
  picture: 'http://danke.cdn.bcebos.com/000/empty.png'
}
export default {
  name: 'AddElement',
  components: {},
  data () {
    return {
      URLS,
      elementCollapseName: 'basic'
    }
  },
  methods: {
    choose (name) {
      this.$emit('selected', name)
    }
  }
}
</script>

<style lang="less">
.tabs-select-element {

}
</style>
