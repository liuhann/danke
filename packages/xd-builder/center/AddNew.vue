<template>
  <div id="add-new-work">
    <div class="content-title">选择作品类型</div>
    <div class="group">
      <div class="group-title">竖屏展示</div>
      <div class="new-types">
        <div v-for="work of appType" :key="work.name" class="work-type" :style="workSizeStyle(work)">
          <div class="name">
            {{ work.name }}
          </div>
          <div class="ratios">
            {{ work.width }} X {{ work.height }}
          </div>
          <div class="action">
            <button @click="newWork(work.width, work.height)">创建</button>
          </div>
        </div>
      </div>
    </div>

    <div class="group">
      <div class="group-title">竖屏展示</div>
      <div class="new-types">
        <div v-for="work of video" :key="work.name" class="work-type" :style="workSizeStyle(work)">
          <div class="name">
            {{ work.name }}
          </div>
          <div class="ratios">
            {{ work.width }} X {{ work.height }}
          </div>
          <div class="action">
            <button @click="newWork(work.width, work.height)">创建</button>
          </div>
        </div>
      </div>
    </div>

    <div class="group">
      <div class="group-title">自由设计</div>
      <div class="new-types">
        <div v-for="work of video" :key="work.name" class="work-type" :style="workSizeStyle(work)">
          <div class="name">
            {{ work.name }}
          </div>
          <div class="ratios">
            {{ work.width }} X {{ work.height }}
          </div>
          <div class="action">
            <button @click="newWork(work.width, work.height)">创建</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { slideShow, video, appType } from './workType'
import { InputNumber } from 'element-ui'
export default {
  name: 'AddNew',
  components: {
    [InputNumber.name]: InputNumber
  },
  data () {
    return {
      appType,
      slideShow,
      video,
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
    },
    newWork (width, height) {
      window.open(`/xd?width=${width}&height=${height}`)
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

  .group {
    margin-top: 20px;
    .group-title {
      font-size: 1.75rem;
      padding:0 16px;
      color: #434343;
    }
  }
  .new-types {
    display: flex;
    flex-wrap: nowrap;
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
        margin-bottom: .8rem;
        font-size: 16px;
        color: #00bf72;
      }
      .ratios {
        color: #999;
      }
      .action {
        margin-top: 1.5rem;
        button {
          font-size: 1.2rem;
          color: #00c4cc;
          padding: 5px 10px;
          letter-spacing: .2rem;
          line-height: 1.4;
          transition: background-color .1s linear,border-color .1s linear,color .1s linear;
          vertical-align: middle;
          align-items: center;
          background-color: #fff;
          border: 1px solid #00c4cc;
          border-radius: 4px;
          cursor: pointer;
          text-align: center;
          &:hover {
            background-color: #00c4cc;
            color: #fff;
            transition: all .2s ease-in;
          }
        }
      }
    }
    .el-input-number--mini {
      width: 80px;
      margin: 0 10px;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-left: 5px;
      padding-right: 28px;
    }
  }
}
</style>
