<template>
<div id="addon-shape-list">
  <div class="hint">拖拽形状到设计区</div>
  <div class="basic-shape">
    <div class="object-item" draggable @dragstart="dragStart({
      style: {
        background: 'var(--backgroundColor)',
        clipPath: '',
        basic: {
          name: 'config',
          variables: [{
            name: 'backgroundColor',
            value: '#00bf72',
            type: 'background'
          }]
        }
      }
    }, $event)" @dragend="dragEnd()">
      <div class="rectangle">
      </div>
    </div>
    <div class="object-item" draggable @dragstart="dragStart({
      style: {
        background: 'transparent',
        borderColor: 'var(--borderColor)',
        borderStyle: 'solid',
        borderWidth: 'var(--borderWidth)',
        basic: {
          name: 'config',
          variables: [{
            name: 'borderColor',
            value: '#00bf72',
            type: 'color'
          }, {
            name: 'borderWidth',
            value: 2,
            type: 'number'
          }]
        }
      }
    }, $event)" @dragend="dragEnd()">
      <div class="rectangle">
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
export default {
  name: 'LeftShapeList',
  mixins: [ objectListMixin ],
  components: {
    [Pagination.name]: Pagination
  },
  data () {
    return {
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
      .rectangle {
        width: 70px;
        height: 70px;
        background-color: #00bf72;
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
