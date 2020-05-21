<template>
<div id="clippath-editor">
  <div class="clippath-tools">
    <div class="field-item">
      <label>填充</label>
      <el-color-picker size="mini" v-model="color" show-alpha/>
    </div>
    <div class="field-item">
      <label>边宽</label>
      <el-input-number size="mini" controls-position="right" v-model="strokeWidth"/>
    </div>
    <div class="field-item">
      <label>颜色</label>
      <el-color-picker size="mini" v-model="strokeColor" show-alpha/>
    </div>
    <div class="field-item">
      <label>闭合</label>
      <el-checkbox v-model="closePath"/>
    </div>
    <div class="field-item">
      <div class="action" @click="removePoint">删除节点</div>
    </div>
    <div class="field-item align-right">
      <i class="el-icon-close" @click="closePathEditor"/>
      <i class="el-icon-check" @click="confirmPath"/>
    </div>
  </div>
  <div class="clippath-container">
    <div class="scene-back" :style="{
      left: viewPortRect.left + 'px',
      top: viewPortRect.top + 'px',
      background: work.color
    }">
      <render-scene :scene="scene" :view-port="viewPortRect" :view-box="viewBox"/>
    </div>
    <div class="paint-container" id="paint-container" :style="{
      left: viewPortRect.left + 'px',
      top: viewPortRect.top + 'px'
    }">
      <Container ref="container" :w="viewPortRect.width" :h="viewPortRect.height" :close-path="closePath" :points="points" :color="color" :stroke-width="strokeWidth" :stroke-color="strokeColor"/>
    </div>
  </div>
</div>
</template>

<script>
import { InputNumber, ColorPicker, Checkbox } from 'element-ui'
import Container from './Container'
import RenderScene from '../render/RenderScene'
export default {
  name: 'ClippathEditor',
  components: {
    RenderScene,
    Container,
    [InputNumber.name]: InputNumber,
    [ColorPicker.name]: ColorPicker,
    [Checkbox.name]: Checkbox
  },
  props: {
    work: {
      type: Object
    },
    viewBox: {
      type: Object
    },
    scene: {
      type: Object
    },
    viewPortRect: {
      type: Object
    },
  },
  data () {
    return {
      color: 'rgba(0,0,0,0)',
      strokeWidth: 1,
      strokeColor: '#555',
      closePath: false,
      points:  [
        { x: 100, y: 300 },
        { x: 200, y: 300, q: { x: 150, y: 50 } }
      ]
    }
  },
  methods: {
    removePoint () {
      this.$refs.container.removePoint()
    },
    closePathEditor () {
      this.$emit('close')
    },
    confirmPath () {
      const reduced = this.reducePath(this.points)
      this.$emit('input', reduced)
    },

    reducePath (points) {
      const rect = document.getElementById('svg-path').getBoundingClientRect()
      const containerRect = document.getElementById('paint-container').getBoundingClientRect()

      const x = rect.left - containerRect.left
      const y = rect.top - containerRect.top

      const reducedPoints = JSON.parse(JSON.stringify(points))
      for (let point of reducedPoints) {
        point.x = point.x - x
        point.y = point.y - y
        if (point.q) {
          point.q.x = point.q.x - x
          point.q.y = point.q.y - y
        }
        if (point.c) {
          point.c[0].x = point.c[0].x - x
          point.c[0].y = point.c[0].y - y
          point.c[1].x = point.c[1].x - x
          point.c[1].y = point.c[1].y - y
        }
      }
      return {
        color: this.color,
        strokeWidth: this.strokeWidth,
        strokeColor: this.strokeColor,
        closePath: this.closePath,
        x,
        y,
        points: reducedPoints,
        w: rect.width,
        h: rect.height
      }
    }
  }
}
</script>

<style lang="scss">
#clippath-editor {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background-color: #f5f5f4;
  .clippath-tools {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    height: 40px;
    background: #fff;
    line-height: 28px;
    padding: 6px 12px;
    display: flex;
    z-index: 10001;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;
    font-size: 14px;
    .field-item {
      line-height: 26px;
      display: flex;
      label {
        padding:0 5px;
      }
      .el-input-number--mini {
        width: 80px;
      }
      .action {
        margin: 0 10px;
        color:#EA4335;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
          background: #fafafa;
        }
      }
      &.align-right {
        margin-left: auto;
        i {
          padding: 5px 8px;
          font-size: 16px;
          cursor: pointer;
          margin: 0 5px;
          &:hover {
            background: #fafafa;
          }
        }
      }
    }
  }
  .clippath-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 40px;
    overflow: hidden;
    .paint-container {
      position: absolute;
    }
  }
  .scene-back {
    position: absolute;
    overflow: hidden;
    .scene {
      position: relative;
      .element {
        position: absolute;
      }
    }
  }
}

</style>
