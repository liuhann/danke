<template>
<div class="edit-background">
  <van-row type="flex" justify="space-around">
    <van-col span="8" class="tc label">模式</van-col>
    <van-col span="16">
      <select v-model="colorMode">
        <option value="1">纯色</option>
        <option value="2">渐变</option>
        <option value="0">透明</option>
      </select>
    </van-col>
  </van-row>
  <van-row v-if="colorMode==='1'" type="flex" justify="space-around">
    <van-col span="8" class="tc label">颜色</van-col>
    <van-col span="16"><van-button @click="selectColor" type="primary" plain size="small">选择</van-button></van-col>
  </van-row>
  <van-row v-if="colorMode==='2'" type="flex" justify="space-around">
    <van-col span="8" class="tc label">渐变颜色</van-col>
    <van-col span="20"><van-button @click="selectColor" type="primary" plain size="small">选择</van-button></van-col>
  </van-row>
  <van-row v-if="colorMode==='2'" type="flex" justify="space-around">
    <van-col span="8" class="tc label">渐变模式</van-col>
    <van-col span="20">
      <select v-model="gradientMode">
        <option value="1">上下</option>
        <option value="2">左右</option>
        <option value="3">左上-右下</option>
        <option value="4">右上-左下</option>
      </select>
    </van-col>
  </van-row>
  <pop-color-picker ref="colorPicker" @input="changeColor(color)"></pop-color-picker>
</div>
</template>

<script>
import PopColorPicker from './PopColorPicker'
export default {
  name: 'EditBackground',
  components: {
    PopColorPicker
  },
  props: {
    background: {
      type: Object
    }
  },
  data () {
    const result = {}
    if (this.background.mode === 0) {
      result.colorMode = this.background.mode
    }
    return result
    return {
      colorMode: '1',
      gradientMode: '1'
    }
  },
  methods: {
    selectColor () {
      this.$refs.colorPicker.show()
    },
    changeColor (color) {

    }
  }
}
</script>

<style scoped>

</style>
