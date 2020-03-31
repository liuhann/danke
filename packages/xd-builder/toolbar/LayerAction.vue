<template>
<span>
  <el-tooltip class="item" effect="dark" content="向上一层" placement="bottom" slot="reference">
    <a class="action" @click="moveElementUp"><img class="wide" :src="ICON_LAYER_UP"></a>
  </el-tooltip>
  <el-tooltip class="item" effect="dark" content="向下一层" placement="bottom" slot="reference">
    <a class="action" @click="moveElementDown"><img class="wide" :src="ICON_LAYER_DOWN"></a>
  </el-tooltip>
</span>
</template>

<script>
import ICON_LAYER_UP from './res/list-up.svg'
import ICON_LAYER_DOWN from './res/layer-down.svg'
import toolbarPopMixin from './toolbarPopMixin'
export default {
  name: 'LayerAction',
  mixins: [ toolbarPopMixin ],
  data () {
    return {
      ICON_LAYER_UP,
      ICON_LAYER_DOWN
    }
  },
  methods: {
    // 移动元素上一层 （数组向后一个）
    moveElementUp () {
      const currentIndex = this.scene.elements.indexOf(this.element)
      if (currentIndex < this.scene.elements.length - 1) {
        this.scene.elements.splice(currentIndex, 1)
        this.scene.elements.splice(currentIndex + 1, 0, this.element)
      }
    },
    moveElementDown () {
      const currentIndex = this.scene.elements.indexOf(this.element)
      if (currentIndex > 0) {
        this.scene.elements.splice(currentIndex, 1)
        this.scene.elements.splice(currentIndex - 1, 0, this.element)

        // this.scene.elements[currentIndex] = this.scene.elements[currentIndex - 1]
        // this.scene.elements[currentIndex - 1] = this.element
      }
    }
  }
}
</script>

<style scoped lang="scss">
.action {
  img {
    width: 26px;
  }
}
</style>