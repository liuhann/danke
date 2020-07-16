<template>
  <div id="page-clippath-editor">
    <el-form size="mini">
      <el-form-item label="填充">
        <el-input-number v-model="width" size="mini" controls-position="right" />
        <el-input-number v-model="height" size="mini" controls-position="right" />
      </el-form-item>
      <el-form-item label="填充">
        <el-color-picker v-model="color" size="mini" show-alpha />
      </el-form-item>
      <el-form-item label="边宽">
        <el-input-number v-model="strokeWidth" size="mini" controls-position="right" />
      </el-form-item>
      <el-form-item label="颜色">
        <el-color-picker v-model="strokeColor" size="mini" show-alpha />
      </el-form-item>
      <el-form-item label="闭合">
        <el-checkbox v-model="closePath" />
      </el-form-item>
      <el-form-item label="点坐标">
        <span v-for="(point,index) in points" :key="index" class="points">
          <el-input-number :value="point.x - borderX" size="mini" controls-position="right" @input="v => { point.x = v + borderX }" />
          <el-input-number :value="point.y - borderY" size="mini" controls-position="right" @input="v => { point.y = v + borderY }" /></span>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="removePoint">删除节点</el-button>
        <el-button @click="confirmPath">保存</el-button>
      </el-form-item>
    </el-form>
    <div id="clippath-container" class="clippath-container">
      <div id="paint-container" class="paint-container">
        <Container ref="container" :w="viewPortRect.width" :h="viewPortRect.height" :close-path="closePath" :points="points" :color="color" :stroke-width="strokeWidth" :stroke-color="strokeColor" />
      </div>
      <div id="svg-border" class="svg-border" :style="{
        width: width + 'px',
        height: height + 'px'
      }"
      />
    </div>
  </div>
</template>

<script>
import { InputNumber, ColorPicker, Checkbox, Form, FormItem, Button } from 'element-ui'
import RestDAO from '../utils/restdao'
import Container from '../xd-builder/clippath-maker/Container'
export default {
  name: 'ClippathEditor',
  components: {
    Container,
    [InputNumber.name]: InputNumber,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [ColorPicker.name]: ColorPicker,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox
  },
  data () {
    return {
      borderX: 0,
      borderY: 0,
      width: 480,
      height: 480,
      viewPortRect: {
        width: 400,
        height: 400
      },
      svgContent: '',
      color: 'rgba(0,0,0,0)',
      strokeWidth: 1,
      strokeColor: '#555',
      closePath: false,
      points: [
        { x: 100, y: 300 },
        { x: 200, y: 300, q: { x: 150, y: 50 } }
      ]
    }
  },
  mounted () {
    this.dao = new RestDAO(this.ctx, 'danke/path')
    const clipContainer = document.getElementById('clippath-container')
    this.viewPortRect.height = clipContainer.getBoundingClientRect().height
    this.viewPortRect.width = clipContainer.getBoundingClientRect().width

    if (this.$route.query.id) {
      this.load(this.$route.query.id)
    } else {
      this.init()
    }
  },
  methods: {
    async load(id) {
      const object = await this.dao.getOne(id)
      this.color = object.color
      this.strokeWidth = object.strokeWidth
      this.strokeColor = object.strokeColor
      this.closePath = object.closePath
      this.points = object.points
      this.width = object.width
      this.height = object.height
      this.$nextTick(this.init)
    },
    init () {
      const containerRect = document.getElementById('paint-container').getBoundingClientRect()
      const rect = document.getElementById('svg-border').getBoundingClientRect()

      const x = rect.left - containerRect.left
      const y = rect.top - containerRect.top

      for (let point of this.points) {
          point.x = point.x + x
          point.y = point.y + y
          if (point.q) {
            point.q.x = point.q.x + x
            point.q.y = point.q.y + y
          }
          if (point.c) {
            point.c[0].x = point.c[0].x + x
            point.c[0].y = point.c[0].y + y
            point.c[1].x = point.c[1].x + x
            point.c[1].y = point.c[1].y + y
          }
      }
      this.borderX = x
      this.borderY = y
    },
    removePoint () {
      this.$refs.container.removePoint()
    },
    confirmPath () {
      const reduced = this.reducePath(this.points)
      console.log(reduced)
      if (this.$route.query.id) {
        reduced._id = this.$route.query.id
      }
      this.dao.createOrPatch(reduced)
    },

    reducePath (points) {
      const containerRect = document.getElementById('paint-container').getBoundingClientRect()
      const rect = document.getElementById('svg-border').getBoundingClientRect()

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
        points: reducedPoints,
        width: this.width,
        height: this.height
      }
    }
  }
}
</script>

<style lang="scss">
#page-clippath-editor {
  box-sizing: border-box;
  display: flex;
  height: 100%;;
  .el-form {
    padding: 20px;
    width: 360px;
    background: #fafafa;
    .points {
      margin: 0 10px;
    }
  }
  .clippath-container {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .paint-container {
      background: transparent;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .svg-border {
      width: 300px;
      height: 300px;
      border: 1px solid #eee;
      background: #fefefe;
      z-index: -1;
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
