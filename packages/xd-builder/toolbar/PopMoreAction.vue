<template>
<el-popover
  placement="bottom-end"
  width="360"
  title="视觉位置及调整"
  trigger="click">
  <el-tooltip class="item" effect="dark" content="位置及层次" placement="bottom" slot="reference">
    <a class="action"><icon-layer /></a>
  </el-tooltip>
  <el-form label-width="70px" size="mini" class="more-action-form">
    <el-form-item label="宽高">
      <el-input-number v-model="element.width" :disabled="!element.props.resizable" controls-position="right" size="mini"/>-<el-input-number v-model="element.height" :disabled="!element.props.resizable" controls-position="right" size="mini" />
<!--      <el-checkbox v-model="element.props.resizable" @change="reInitElementDragResize" />-->
    </el-form-item>
    <el-form-item label="坐标">
      <el-input-number v-model="element.x" :disabled="!element.props.movable" controls-position="right" size="mini"/>-<el-input-number v-model="element.y" :disabled="!element.props.movable" controls-position="right" size="mini" />
<!--      <el-checkbox v-model="element.props.movable" @change="reInitElementDragResize" />-->
    </el-form-item>
    <el-form-item label="显示次序">
      <el-button-group size="mini">
        <el-button @click="moveElementTop">顶层</el-button>
        <el-button @click="moveElementUp">上一层</el-button>
        <el-button @click="moveElementDown">下一层</el-button>
        <el-button @click="moveElementBottom">底层</el-button>
      </el-button-group>
    </el-form-item>
  </el-form>
</el-popover>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import interactMixins from '../mixins/interactMixins'
import IconLayer from './res/size.svg'
import ICON_LAYER_UP from './res/layer-up.svg'

export default {
  name: 'PopMoreAction',
  mixins: [ toolbarPopMixin, interactMixins ],
  components: {
    IconLayer
  },
  data () {
    return {
      ICON_SIZE,
      ICON_LAYER_UP
    }
  },
  computed: { },
  methods: {
    reInitElementDragResize (val) {
      this.$emit('reset', this.element)
    },

    // 移动元素到最顶层 （数组最后一个）
    moveElementTop () {
      let currentIndex = this.scene.elements.indexOf(this.element)
      while (currentIndex < this.scene.elements.length - 1) {
        this.moveElementUp()
        currentIndex ++
      }
    },
    moveElementBottom () {
      let currentIndex = this.scene.elements.indexOf(this.element)
      while (currentIndex > 0) {
        this.moveElementDown()
        currentIndex --
      }
    },
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

<style lang="scss" scoped>
.more-action-form {
  padding: 16px;
  .el-input-number--mini {
    width: 90px;
    margin: 0 10px;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 5px;
    padding-right: 28px;
  }
}
</style>
