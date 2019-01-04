<template>
<div class="edit-clip-path">
  <van-row type="flex" justify="space-around">
    <van-col span="4" class="tc label">横向对齐</van-col>
    <van-col span="20">
      <van-radio-group v-model="position.align">
        <van-radio name="left">靠左</van-radio>
        <van-radio name="center">居中</van-radio>
        <van-radio name="right">靠右</van-radio>
      </van-radio-group>
    </van-col>
  </van-row>
</div>
</template>

<script>
export default {
  name: 'EditPosition',
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
.edit-clip-path {
  .van-stepper {

  }
}
</style>
