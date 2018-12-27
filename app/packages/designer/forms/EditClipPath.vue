<template>
<div class="edit-clip-path">
  <van-row type="flex" justify="space-around">
    <van-col span="4" class="tc label">左上</van-col>
    <van-col span="20">
      <van-stepper v-model="clip.ax" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.ay" :min="-1000" :max="1000" />
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4" class="tc label">右上</van-col>
    <van-col span="20">
      <van-stepper v-model="clip.bx" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.by" :min="-1000" :max="1000" />
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4" class="tc label">右下</van-col>
    <van-col span="20">
      <van-stepper v-model="clip.cx" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.cy" :min="-1000" :max="1000" />
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="4" class="tc label">左下</van-col>
    <van-col span="20">
      <van-stepper v-model="clip.dx" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.dy" :min="-1000" :max="1000" />
    </van-col>
  </van-row>
</div>
</template>

<script>
export default {
  name: 'EditClipPath',
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      clip: this.value || {
        ax: 0,
        ay: 0,
        bx: 100,
        by: 0,
        cx: 100,
        cy: 100,
        dx: 0,
        dy: 100
      }
    }
  },
  created () {

  },
  watch: {
    clip: {
      handler: function (val, oldVal) {
        this.$emit('input', this.clip)
        // this.$emit('input', `polygon(${this.clip.ax}% ${this.clip.ay}%, ${this.clip.bx}% ${this.clip.by}%, ${this.clip.cx}% ${this.clip.cy}%, ${this.clip.dx}% ${this.clip.dy}%)`)
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
