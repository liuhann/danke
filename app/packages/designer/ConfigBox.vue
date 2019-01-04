<template>
<div class="config-box">
 <!--  <div class="drag-handle">
    <van-icon name="wap-nav"></van-icon>
  </div> -->
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
  width: 88vw;
  height: 100vh;

  .van-radio {
    margin-right: 14px;
  }
  .van-radio-group {
    display: flex;
  }

  .van-cell-group {
    margin-bottom: 5px;
  }
  .van-row {
    box-sizing: border-box;
    height: 44px;
    align-items: center;
    background-color: #fff;
  }


  .drag-handle {
    height: 16px;
    text-align: center;
    font-size: 12px;
    border-bottom: 1px solid #eee;
    background-color: #fefefe;
  }
}

</style>
