<template>
<van-tabs v-model="colorTab" class="tab-colors">
  <van-tab title="浅色渐变">
    <div class="color-container">
      <div v-for="(color, index) in cools" :key="index" class="pure-color color-box" :style="{background: 'linear-gradient(to top,' + color[0] + ', ' + color[1] + ')'}">
      </div>
    </div>
  </van-tab>
  <van-tab title="深色渐变">
    <div class="color-container">
      <div v-for="(color, index) in strongs" :key="index" class="pure-color color-box" :style="{background: 'linear-gradient(to top,' + color[0] + ', ' + color[1] + ')'}">
      </div>
    </div>
  </van-tab>
  <van-tab title="自定义">
    <div class="color-container">
      <div v-for="(color, index) in strongs" :key="index" class="pure-color color-box" :style="{backgroundColor: color[0]}">
      </div>
    </div>
  </van-tab>
</van-tabs>
</template>

<script>
import gradients from '../../utils/gradients'
export default {
  name: 'PopGradientPicker',
  data () {
    return {
      cools: gradients.cool.slice(0, 96),
      strongs: gradients.strong.slice(0, 96)
    }
  }
}
</script>

<style scoped>

</style>
