<template>
<vue-draggable-resizable v-if="showEditBox" :resizable="false" :x="20" :y="device.height - 280" :w="device.width - 40" :h="260" :z="9999"
                         drag-handle=".drag-handle"
                         class="element-editing-box">
  <div class="drag-handle">
    <van-icon name="cross" @click="closeBox"></van-icon>
    <van-icon name="wap-nav"></van-icon>
  </div>
  <config-element v-if="element" :element="element"></config-element>
  <config-scene v-if="!scene" :scene="scene"></config-scene>
</vue-draggable-resizable>
</template>

<script>
import ConfigElement from './forms/ConfigElement'
import ConfigScene from './forms/ConfigScene'
import VueDraggableResizable from 'vue-draggable-resizable'
export default {
  name: 'ConfigBox',
  components: {
    ConfigElement,
    ConfigScene,
    VueDraggableResizable
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

.element-editing-box {
  border: 1px solid #eee;
  background-color: #fff;
  z-index: 1001;

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
