<template>
  <van-popup v-model="showAddElement" class="pop-select-element" position="center" :overlay="true">
    <van-tabs v-model="elementCollapseName" class="tabs-select-element">
      <van-tab title="基本元素">
        <van-cell title="图片" icon="photo" :clickable="true" label="可选择照片作为内容" @click="choose('image')"/>
        <van-cell title="文字" icon="edit" :clickable="true" label="可编辑的文字" @click="choose('text')"/>
      </van-tab>
      <van-tab title="图形元素">
        <van-cell title="圆形" :clickable="true" icon="check"  @click="choose('circle')"/>
        <van-cell title="方形" :clickable="true" icon="location" @click="choose('rect')"/>
        <van-cell title="三角形" :clickable="true" icon="location" @click="choose('triangle')"/>
      </van-tab>
    </van-tabs>
  </van-popup>

</template>

<script>
const URLS = {
  picture: 'http://danke.cdn.bcebos.com/000/empty.png'
}
export default {
  name: 'AddElementPopup',
  components: {},
  data () {
    return {
      URLS,
      showAddElement: false,
      elementCollapseName: 'basic'
    }
  },
  methods: {
    show () {
      this.showAddElement = true
    },
    choose (name) {
      this.showAddElement = false
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
