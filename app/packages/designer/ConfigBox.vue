<template>
<div class="config-box">
  <div class="drag-handle">
    <van-icon name="wap-nav"></van-icon>
  </div>
  <config-element v-if="element" :element="element"></config-element>
  <config-scene v-if="!scene" :scene="scene"></config-scene>
</div>
</template>

<script>
import ConfigElement from './forms/ConfigElement'
import ConfigScene from './forms/ConfigScene'
export default {
  name: 'ConfigBox',
  components: {
    ConfigElement,
    ConfigScene,
  },
  props: {
    device: {
      type: Object
    },
    element: {
      type: Object
    },
    scene: {
      type: Object
    }
  },
  data () {
    return {
      showEditBox: false
    }
  },

  methods: {
    closeBox () {
      this.showEditBox = false
    },
    show () {
      this.showEditBox = true
    }
  }
}
</script>

<style lang="less">

.config-box {
  border-left: 1px solid #eee;
  background-color: #fff;
  z-index: 1001;
  width: 80vw;
  height: 100vh;

  .drag-handle {
    height: 24px;
    text-align: center;
    border-bottom: 1px solid #eee;
    background-color: #fefefe;
    .van-icon {
      color: #ccc;
      margin: 0 10px;
      &.van-icon-cross {
        color: #666;
        line-height: 24px;
        float: right;
      }
    }
  }
}

</style>
