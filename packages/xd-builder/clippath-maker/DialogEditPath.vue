<template>
<el-dialog
  title="编辑图片路径"
  top="5vh"
  :visible.sync="dialogVisible">
  <div class="path-options">
    <label>宽度</label>
    <el-input-number size="mini" controls-position="right" v-model="w"/>
    <label>高度</label>
     <el-input-number size="mini" controls-position="right" v-model="h"/>
    <label>填充</label>
    <el-color-picker size="mini" v-model="color" show-alpha/>
    <label>边宽</label>
    <el-input-number size="mini" controls-position="right" v-model="strokeWidth"/>
    <label>颜色</label>
    <el-color-picker size="mini" v-model="strokeColor" show-alpha/>
  </div>
  <Container :w="w" :h="h" :points="points" :color="color" :stroke-width="strokeWidth" :stroke-color="strokeColor"/>
  <div >
    <el-button @click="insertPathElement">插入图片</el-button>
  </div>
</el-dialog>
</template>

<script>
import { Dialog, InputNumber, ColorPicker, Button } from 'element-ui'
import Container from './Container'
export default {
  name: 'DialogEditPath',
  components: {
    Container,
    [ColorPicker.name]: ColorPicker,
    [InputNumber.name]: InputNumber,
    [Dialog.name]: Dialog,
    [Button.name]: Button
  },
  data () {
    return {
      color: '#999',
      strokeWidth: 4,
      strokeColor: '#555',
      w: 600,
      h: 600,
      points:  [
        { x: 100, y: 300 },
        { x: 200, y: 300, q: { x: 150, y: 50 } },
        { x: 300, y: 300, q: { x: 250, y: 450 } },
        { x: 400, y: 300, q: { x: 350, y: 50 } }
      ],
      dialogVisible: false
    }
  },
  methods: {
    open (element) {
      if (element) {
        this.points = element.path.points
        this.w = element.path.w
        this.h = element.path.h
      } else {
        this.w = 480
        this.h = 480
        this.dialogVisible = true
      }
    },
    insertPathElement () {
      this.$emit('insert', {
        variables: [{
          name: 'fill',
          value: this.color,
          type: 'color'
        }, {
          name: 'stokeWidth',
          value: this.strokeWidth,
          type: 'px'
        }, {
          name: 'stroke',
          value: this.strokeColor,
          type: 'color'
        }],
        path: {
          w: this.w,
          h: this.h,
          points: this.points
        }
      })
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
  .path-options {
    margin: 10px 0;
    display: flex;
    >label {
      line-height: 28px;
      margin: 0 10px;
    }
  }
</style>
