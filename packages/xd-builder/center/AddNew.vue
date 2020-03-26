<template>
<div id="add-new-work">
  <div class="content-title">空白项目</div>
  <div class="column">
    <div class="new-types">
      <div v-for="work of workType" :key="workType.name" class="work-type" :style="workSizeStyle(work)">
        <div class="name">
          {{work.name}}
        </div>
        <div class="ratios">
          {{work.width}} X {{work.height}}
        </div>
      </div>
      <div class="work-type">
        <div class="name">
          自定义尺寸
        </div>
        <div class="ratios">
          <el-input-number v-model="workWidth" size="mini" width="80" controls-position="right"/> X <el-input-number v-model="workWidth" size="mini" width="80" controls-position="right"/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import workType from './workType'
import { InputNumber } from 'element-ui'
export default {
  name: 'AddNew',
  components: {
    [InputNumber.name]: InputNumber
  },
  data () {
    return {
      workType,
      columnHeight: 200,
      workWidth: 300,
      workHeight: 200
    }
  },
  methods: {
    workSizeStyle (work) {
      return {
        height: this.columnHeight + 'px',
        width: this.columnHeight / work.height * work.width + 'px'
      }
    }
  }
}
</script>

<style lang="scss">

#add-new-work {
  .column {
    width: 100%;
    overflow: hidden;
  }
  .new-types {
    display: flex;
    width: 100%;
    overflow-x: auto;
    .work-type {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 1px 4px 0 #dedee4;
      .name {
        margin-bottom: 2rem;
        font-size: 16px;
        color: #00bf72;
      }
      .ratios {
        color: #999;
      }
    }
  }
}
</style>
