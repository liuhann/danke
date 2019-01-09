<template>
<div class="config-box">
  <config-element v-if="element" :element="element" @element-change="elementChange" @element-remove="elementRemove"></config-element>
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
    elementRemove () {
      this.$emit('element-remove')
    },
    elementChange (element) {

    },
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

  .van-cell-group {
    margin-bottom: 5px;
  }
  .van-row {
    box-sizing: border-box;
    min-height: 44px;
    align-items: center;
    background-color: #fff;
  }
}

</style>
