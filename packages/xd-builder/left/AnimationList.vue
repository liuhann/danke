<template>
<div id="left-animation-tab">
  <tabs v-model="animationType" @tab-click="handleClick">
    <tab-pane label="进入动画" name="enter"></tab-pane>
    <tab-pane label="离开动画" name="exist"></tab-pane>
  </tabs>
  <div class="animation-container">
    <div v-for="(animation, index) in animations" :key="index"  class="animation-item"
         @mouseenter="animationMouseEnter(animation)"
         @click="choose(animation)">
      <div class="preview-box" :class="animation.name">
        <img :src="CLOUD_HILL" v-if="animation.tags.indexOf('text') === -1"/>
        <span v-if="animation.tags.indexOf('text') > -1">{{animation.title}}</span>
      </div>
      <div v-if="animation.tags.indexOf('text') === -1" class="animation-title">{{animation.title}}</div>
    </div>
  </div>
  <pagination :total="total" :page-size="pageSize" @current-change="loadMoreAnimation" :current-page.sync="page" :pager-count="5" layout="prev, pager, next" />
  <div class="animation-choosed" v-if="currentAnimation">
    <div class="animation-title"><i class="el-icon-arrow-left" @click="closeAnimation" /> <span>应用动画</span></div>
    <div class="preview-box">
      <img :src="CLOUD_HILL" :class="currentAnimation.name"/>
      <div class="refresh"><i @click="refreshCurrent" class="el-icon-refresh-right" /></div>
    </div>
    <div class="animation-form">
      <div class="form-item">
        <div class="label">动画名称</div>
        <div class="field">{{currentAnimation.title}}</div>
      </div>
      <div class="form-item">
        <div class="label">持续时间</div>
        <div class="field"><el-input-number size="mini" controls-position="right" :step="20" v-model="currentAnimation.duration" /></div>
      </div>
      <div class="form-item">
        <div class="label">过渡曲线</div>
        <div class="field">
          <el-select v-model="currentAnimation.timing" size="mini">
            <el-option v-for="(value, key) in cubicBeziers" :key="key" :label="key" :value="value"/>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <div class="label">延迟</div>
        <div class="field"><el-input-number v-model="currentAnimation.delay" size="mini" controls-position="right" :step="20" /></div>
      </div>
      <div class="form-item">
        <div class="label">延迟递增</div>
        <div class="field"><el-input-number v-model="currentAnimation.inc" size="mini" controls-position="right" :step="20" /></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import { Pagination, Tabs, TabPane, Button, InputNumber, Select, Option } from 'element-ui'
import cubicBeziers from '../../frames/model/cubic-beziers'
import CLOUD_HILL from '../../vectors/cloud-hill.webp'
export default {
  name: 'AnimationList',
  components: {
    Pagination,
    Tabs,
    TabPane,
    [InputNumber.name]: InputNumber,
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    type: {
      type: String
    }
  },
  data () {
    return {
      cubicBeziers,
      animationType: 'enter',
      CLOUD_HILL,
      animations: [],
      page: 0,
      pageSize: 27,
      total: 0,
      delayInc: 200,
      currentAnimation: null
    }
  },

  mounted () {
    this.restdao = new RestDAO(this.ctx, 'danke/animation')
    this.loadMoreAnimation()
  },
  methods: {
    handleClick () {
      this.page = 0
      this.loadMoreAnimation()
    },
    async loadMoreAnimation () {
      const result = await this.restdao.list({
        page: this.page,
        count: this.pageSize,
        tags: this.animationType
      })
      this.total = result.total
      this.styles = result.list
      this.animations = result.list
      for (let animation of this.animations) {
        this.ctx.styleRegistry.addFrame(animation)
      }
    },
    // 鼠标移动上面之后会进行frame演示
    animationMouseEnter (animation) {
      const replayStore = animation.name
      animation.name = 'none'
      setTimeout(() => {
        animation.name = replayStore
      }, 300)
    },

    refreshCurrent () {
      const replayStore = this.currentAnimation.name
      this.currentAnimation.name = ''
      setTimeout(() => {
        this.currentAnimation.name = replayStore
      }, 200)
    },

    // 取消动画
    closeAnimation () {
      this.currentAnimation = null
      this.$emit('animation', null)
    },

    choose(animation) {
      const currentAnimation = JSON.parse(JSON.stringify(animation))
      currentAnimation.stage = this.animationType
      currentAnimation.delay = 0
      currentAnimation.inc = 300

      this.currentAnimation = currentAnimation
      this.$emit('animation', this.currentAnimation)
    }
  }
}
</script>

<style lang="scss">
#left-animation-tab {
  display: flex;
  flex-direction: column;
  .el-pagination {
    button, li {
      background: transparent;
      color: #eee;
      &.active {
        color: #00c4cc;
      }
      &:disabled {
        color: #596c7d;
      }
    }
  }
  .el-tabs {
    width: 100%;
    .el-tabs__header {
      margin-bottom: 5px;
    }
    .el-tabs__nav {
      margin-left: 10px;
    }
    .el-tabs__item {
      color: #eee;
      &.is-active {
        color: #00c4cc;
      }
    }
    .el-tabs__active-bar {
      background-color: #00c4cc;
    }
  }
  .animation-container {
    display: flex;
    flex-wrap: wrap;
    flex:1;
    overflow-y: auto;
  }
  .animation-item {
    width: 108px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 108px;
    overflow: hidden;
    position: relative;
    perspective: 200px;
    &:hover {
      background: rgba(0,0,0, .05);
      .animation-title {
        display: none;
      }
    }
    .animation-title {
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      text-align: center;
      font-size: 12px;
      color: #fff;
    }
    .preview-box {
      overflow: hidden;
      perspective: 200px;
      width: 60px;
      height: 60px;
      position: relative;
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
      span {
        height: 60px;
        display: inline-block;
        line-height: 60px;
        font-size: 18px;
        width: 220px;
        margin-left: -75px;
        text-align: center;
      }
    }
    .preview-box.none {
      opacity: 0;
      transition: opacity .3s ease-in;
    }
  }

  .animation-choosed {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 999;
    .animation-title {
      font-size: 16px;
      i {
        border-right: 1px solid #efefef;
        padding: 12px;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: #00c4cc;
        }
      }
      span {
        padding: 12px;
        display: inline-block;
      }
    }
    .preview-box {
      perspective: 200px;
      width: 100%;
      height: 240px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fafafa;
      .refresh {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: #00c4cc;
        }
      }
      img {
        object-fit: cover;
        width: 50%;
        height: 50%;
      }
    }
    .animation-form {
      .form-item {
        display: flex;
        margin-top: 10px;
        line-height: 28px;
        .label {
          width: 90px;
          text-align: right;
          padding-right: 10px;
        }
      }
    }
  }
}


</style>
