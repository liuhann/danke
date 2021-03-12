<template>
  <div class="nav-layer" :class="isMini? 'is-mini': ''">
    <div class="mini">
      <van-icon name="wap-nav" @click="toggleMax" />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant'
import Vue from 'vue'
import 'vant/lib/icon/index.css'

Vue.use(Icon)
export default {
  name: "NavLayerVue",
  data () {
    return {
      isMini: true
    }
  },
  methods: {
    toggleMax () {
      this.isMini = false
    }
  }
}
</script>

<style lang="scss">
.nav-layer {
  position:  absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10001;
  &.is-mini {
    width: 60px;
    height: 60px;
  }
  .mini {
    position: absolute;
    right: 0;
    top: 0;
    background: #00bf72;
    border-bottom-left-radius: 1000px;
    padding: 10px 10px 10px 20px;
    color: #fff;
    font-size: 24px;
  }
}
</style>