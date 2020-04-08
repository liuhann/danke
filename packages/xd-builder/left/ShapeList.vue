<template>
<div id="addon-shape-list">
  <div class="hint">拖拽形状到设计区</div>
  <div class="basic-shape">
    <div
      v-for="(shape, index) in buildInShapes"
      :key="index"
      class="object-item" draggable @dragstart="dragStart(shape, $event)">
      <div class="shape" :style="shapeStyle(shape)">
        {{shape.name}}
      </div>
    </div>
  </div>
  <div class="shape-list">
    <div v-for="(object, index) in objects" :key="index" class="object-item" draggable @dragstart="dragStart(object, $event)" @dragend="dragEnd(object)">
      <div class="svg-container" :style="variableStyle(object)" v-html="object.content">
        <div class="styled-box" >
        </div>
      </div>
    </div>
  </div>
  <el-pagination background :total="total" :page-size="pageSize" @current-change="loadObjects" :current-page.sync="page" layout="prev, pager, next" />
</div>
</template>

<script>
import objectListMixin from '../../common/components/objectListMixin'
import { Pagination } from 'element-ui'

const buildInShapes = [{
  name: '纯色矩形',
  style: {
    background: 'var(--backgroundColor)',
    clipPath: '',
  },
  variables: [{
    name: 'backgroundColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  name: '文字框',
  width: 48,
  height: 48,
  text: '1',
  style: {
    background: 'var(--backgroundColor)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'var(--fontSize)',
    color: 'var(--fontColor)'
  },
  variables: [{
    name: 'backgroundColor',
    value: '#00bf72',
    type: 'color'
  }, {
    name: 'fontSize',
    value: 22,
    type: 'fontSize'
  }, {
    name: 'fontColor',
    value: '#fff',
    type: 'color'
  }]
}, {
  name: '带边框矩形',
  style: {
    background: 'var(--backgroundColor)',
    borderColor: 'var(--borderColor)',
    borderStyle: 'solid',
    borderWidth: 'var(--borderWidth)',
  },
  variables: [{
    name: 'borderColor',
    value: '#00bf72',
    type: 'color'
  }, {
    name: 'borderWidth',
    value: 2,
    type: 'number'
  }, {
    name: 'backgroundColor',
    value: '#10211a',
    type: 'color'
  }]
}]

export default {
  name: 'LeftShapeList',
  mixins: [ objectListMixin ],
  components: {
    [Pagination.name]: Pagination
  },
  data () {
    return {
      buildInShapes,
      restPath: 'danke/svg'
    }
  },
  created () {
  },
  methods: {
    dragStart (object, ev) {
      // stringify image info as text
      console.log('drag object', object)
      ev.dataTransfer.setData('Text', JSON.stringify(object))
      this.draggingImage = true
    },

    shapeStyle (shape) {
      const style = Object.assign({}, shape.style)
      if (shape.variables) {
        for (let variable of shape.variables) {
          if (variable.type === 'number') {
            Object.assign(style, {
              ['--' + variable.name]: variable.value + 'px'
            })
          } else {
            Object.assign(style, {
              ['--' + variable.name]: variable.value
            })
          }
        }
      }
      return style
    },
    // load list callback
    objectUpdated () {
      for (let object of this.objects) {
        this.ctx.styleRegistry.addVector(object)
      }
    },
    dragEnd () {
      this.draggingImage = false
    }
  }
}
</script>

<style lang="scss">
#addon-shape-list {
  .basic-shape {
    display: flex;
    flex-wrap: wrap;
    .object-item {
      width: 98px;
      height: 100px;
      margin-bottom: 20px;
      margin-right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
      .shape {
        width: 70px;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #fff;
      }
    }
  }
  .shape-list {
    display: flex;
    flex-wrap: wrap;
    .object-item {
      width: 98px;
      height: 100px;
      margin-bottom: 20px;
      margin-right: 20px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
      .svg-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
