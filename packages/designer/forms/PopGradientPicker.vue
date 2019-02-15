<template>
<div class="gradient-color-picker">
  <div class="color-preview" :style="gradientStyle" @click="isShow = true">
  </div>
  <van-popup v-model="isShow" class="pop-gradient-picker" position="bottom" :overlay="true" get-container="body">
    <van-cell title="过渡颜色选取">
      <van-icon slot="right-icon" name="cross" class="custom-icon" @click="isShow = false"/>
    </van-cell>
    <van-tabs v-model="colorTab" class="tab-colors">
      <van-tab title="浅色渐变">
        <div class="color-container">
          <div v-for="(color, index) in cools" @click="chooseColor(color)" :key="index" class="color-box" :style="{background: 'linear-gradient(to top,' + color[0] + ', ' + color[1] + ')'}">
          </div>
        </div>
      </van-tab>
      <van-tab title="深色渐变">
        <div class="color-container">
          <div v-for="(color, index) in strongs" @click="chooseColor(color)" :key="index" class="color-box" :style="{background: 'linear-gradient(to top,' + color[0] + ', ' + color[1] + ')'}">
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </van-popup>
</div>

</template>

<script>
import gradients from '../templates/gradients'
import styles from '../../utils/styles'
export default {
  name: 'PopGradientPicker',
  props: {
    value: {
      type: Array
    },
    angle: {
      type: String
    }
  },
  data () {
    return {
      gradients: this.value,
      colorTab: 0,
      isShow: false,
      cools: gradients.cool.slice(0, 96),
      strongs: gradients.strong.slice(0, 96)
    }
  },
  computed: {
    gradientStyle () {
      return this.getGradientStyle(this.gradients, this.angle)
    }
  },
  methods: {
    getGradientStyle: styles.getGradientStyle,

    chooseColor (gradients) {
      this.isShow = false
      this.gradients = gradients
      this.$emit('input', gradients)
    }
  }
}
</script>

<style lang="less">
.pop-gradient-picker {
  .color-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    height: 60vw;
    overflow-y: auto;
  }
}

.color-preview, .color-box {
  box-sizing: border-box;
  border: 1px solid #efefef;
  width: 10vw;
  margin: 1vw;
  border-radius: 4px;
  height: 10vw;
}


</style>
