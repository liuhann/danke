<template>
<div class="edit-position config-group">
  <item-block title="横向对齐">
    <van-radio-group v-model="position.horizontal">
      <van-radio name="left">左</van-radio>
      <van-radio name="center">居中</van-radio>
      <van-radio name="right">右</van-radio>
    </van-radio-group>
  </item-block>
  <edit-len label="横向偏移" v-model="position.offsetX" :min="-1000" :max="1000"></edit-len>

  <item-block title="纵向对齐">
    <van-radio-group v-model="position.vertical">
      <van-radio name="top">上</van-radio>
      <van-radio name="center">居中</van-radio>
      <van-radio name="bottom">下</van-radio>
    </van-radio-group>
  </item-block>

  <edit-len label="纵向偏移" v-model="position.offsetY"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import ItemBlock from './ItemBlock'
export default {
  name: 'EditPosition',
  components: {
    ItemBlock,
    EditLen
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      // position: this.value
    }
  },
  computed: {
    position () {
      return this.value
    }
  },
  created () {

  }
}
</script>

<style lang="less">

</style>
