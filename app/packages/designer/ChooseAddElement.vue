<template>
  <van-tabs v-model="elementCollapseName" class="tabs-select-element">
    <van-tab title="基本元素">
      <van-cell title="图片" icon="photo" :clickable="true" label="可选择照片作为内容" @click="choose('image')"/>
      <van-cell title="文字" icon="edit" :clickable="true" label="可编辑的文字" />
    </van-tab>
    <van-tab title="图形元素">
      <van-cell title="圆形" :clickable="true" icon="check" />
      <van-cell title="方形" :clickable="true" icon="location" />
      <van-cell title="三角形" :clickable="true" icon="location" />
    </van-tab>
  </van-tabs>
</template>

<script>
const URLS = {
  picture: 'http://danke.cdn.bcebos.com/000/empty.png'
}
export default {
  name: 'ChooseAddElement',
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
  width: 80vw;
  height: 60vh;
  overflow-y: auto;
}
</style>
