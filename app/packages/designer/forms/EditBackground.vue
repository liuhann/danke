<template>
<div class="edit-background">
  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">模式</van-col>
    <van-col span="18">
      <select v-model="background.mode">
        <option value="1">纯色</option>
        <option value="2">渐变</option>
        <option value="0">透明</option>
      </select>
    </van-col>
  </van-row>
  <van-row v-if="background.mode==='1'" type="flex" justify="space-around">
    <van-col span="6" class="tc label">颜色</van-col>
    <van-col span="18">
      <pop-color-picker v-model="background.color"></pop-color-picker>
    </van-col>
  </van-row>
  <van-row v-if="background.mode==='2'" type="flex" justify="space-around">
    <van-col span="6" class="tc label">渐变颜色</van-col>
    <van-col span="18">
      <pop-gradient-picker v-model="background.gradients" :angle="background.angle" ></pop-gradient-picker>
    </van-col>
  </van-row>
  <van-row v-if="background.mode==='2'" type="flex" justify="space-around">
    <van-col span="8" class="tc label">渐变模式</van-col>
    <van-col span="16">
      <select v-model="background.angle">
        <option value="to bottom">上下</option>
        <option value="to right">左右</option>
      </select>
    </van-col>
  </van-row>
</div>
</template>

<script>
import PopColorPicker from './PopColorPicker'
import PopGradientPicker from './PopGradientPicker'
export default {
  name: 'EditBackground',
  components: {
    PopColorPicker,
    PopGradientPicker
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      background: this.value
    }
  },

  watch: {
    background: {
      deep: true,
      handler: function () {
        this.$emit('input', this.background)
      }
    }
  },

  methods: {

  }
}
</script>

<style>

</style>
