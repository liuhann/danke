<template>
  <pop-wrapper ref="popWrapper" icon="el-icon-circle-plus-outline" :popover="true">
    <div class="blocks">
      <div class="block-title">
        自定义图案
      </div>
    </div>
    <div class="blocks" />
    <div class="blocks">
      <div class="block-title">
        基本图形
      </div>
      <div class="shape-list">
        <div
          v-for="(shape, index) in rects"
          :key="index"
          class="shape-item"
          @click="chooseShapeItem(shape)"
        >
          <div class="shape" :style="shapeStyle(shape)" />
        </div>
      </div>
    </div>
  </pop-wrapper>
</template>

<script>
import PopWrapper from './PopWrapper'
import shapes from './shapes'
import rects from '../shapes/rects'
import { assignVariables } from '../mixins/renderUtils'
export default {
  name: 'PopNewElement',
  components: { PopWrapper },
  data() {
    return {
      rects
    }
  },
  methods: {
    chooseShapeItem (shape) {
      this.$emit('draw', JSON.parse(JSON.stringify(shape)))
      this.$refs.popWrapper.dialogVisible = false
    },
    shapeStyle (shape) {
      const style = Object.assign({}, shape.style)
      assignVariables(style, shape.variables)
      return style
    },
  }
}
</script>

<style lang="scss">
.blocks {
  .block-title {
    margin: 10px 0;
    padding: 0 8px;
  }
  .shape-list {
    display: flex;
    flex-wrap: wrap;
    .shape-item {
      width: 42px;
      height: 42px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      .shape {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
