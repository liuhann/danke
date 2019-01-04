<template>
<div class="edit-position config-group">
  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">横向对齐</van-col>
    <van-col span="18">
      <van-radio-group v-model="position.align">
        <van-radio name="left">左</van-radio>
        <van-radio name="center">居中</van-radio>
        <van-radio name="right">右</van-radio>
      </van-radio-group>
    </van-col>
  </van-row>
  <edit-len label="横向偏移" v-model="position.margin"></edit-len>
  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">纵向对齐</van-col>
    <van-col span="18">
      <van-radio-group v-model="position.vertical">
        <van-radio name="top">上</van-radio>
        <van-radio name="center">居中</van-radio>
        <van-radio name="bottom">下</van-radio>
      </van-radio-group>
    </van-col>
  </van-row>
  <edit-len label="纵向偏移" v-model="position.margin"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
export default {
  name: 'EditPosition',
  components: {
    EditLen
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      position: this.value
    }
  },
  created () {

  },
  watch: {
    clip: {
      handler: function (val, oldVal) {
        this.$emit('input', this.clip)
      },
      deep: true
    }
  }
}
</script>

<style lang="less">

</style>
