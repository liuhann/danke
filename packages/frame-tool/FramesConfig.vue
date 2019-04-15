<template>
<div class="animation-config box">
  <div class="frames">
    <form-field v-model="animation.name" label="动画名称" type="text">
    </form-field>

    <form-field v-model="animation.type" label="动画类型" type="select" :options="animationTypes">
    </form-field>

    <form-field v-model="animation.duration" width="70px" label="时长" placeholder="动画时长" unit="毫秒" type="number">
    </form-field>

    <form-field v-model="animation.timing" label="曲线" type="select" :options="cubicBeziers">
    </form-field>

    <form-field v-model="animation.delay" width="70px" label="延迟" placeholder="动画时长" unit="毫秒" type="number">
    </form-field>

    <form-field v-model="animation.iteration" width="80px" label="次数"  unit="次" type="number">
    </form-field>

    <div class="timeline">
      <div class="timeline-item"
           v-for="(frame, index) in animation.frames" :key="index">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="heading level">
            <div class="level-left is-small">{{frame.percent}}%</div>
            <div class="level-right is-small">
              <a v-if="frame.percent !== 100" class="icon-plus" @click="appendFrame(index)"></a>
              <a v-if="!(frame.percent === 100 || frame.percent === 0)" class="icon-trash-empty" @click="removeFrame(index)"></a>
              <a v-if="currentFrameIndex === index" class="icon-down-open" @click="closeFrame"></a>
              <a v-if="currentFrameIndex !== index" class="icon-right-open" @click="editFrame(index)"></a>
            </div>
          </div>
          <div class="frame-dialog-content" v-if="currentFrameIndex === index">
            <form-field label="进度" width="70px" :disabled="frame.percent === 100 || frame.percent === 0" v-model="frame.percent" unit="%" type="number">
            </form-field>
            <edit-transform v-model="frame.transform"></edit-transform>
            <edit-clip-path v-model="frame.clip"></edit-clip-path>
          </div>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-primary">2017</span>
      </header>
      <div class="timeline-item">
        <div class="timeline-marker is-icon">
          <i class="fa fa-flag"></i>
        </div>
        <div class="timeline-content">
          <p class="heading">March 2017</p>
          <p>Timeline content - Can include any HTML element</p>
        </div>
      </div>
    </div>


    <el-timeline>
      <el-timeline-item
        class="time-line-item"
        placement="top"
        v-for="(frame, index) in animation.frames"
        :key="index"
        :hide-timestamp="true"
        :timestamp="frame.percent + '%'">
        <div class="button-percent">
          {{frame.percent}}%
          <div class="btns" style="float:right;margin-top: -7px;">
            <el-button v-if="frame.percent !== 100" size="mini" icon="el-icon-plus"
            type="text" @click="appendFrame(index)"></el-button>
            <el-button v-if="!(frame.percent === 100 || frame.percent === 0)" size="mini" icon="el-icon-delete"
            type="text" @click="removeFrame(index)"></el-button>
            <el-button v-if="currentFrameIndex === index" size="mini" icon="el-icon-arrow-down"
            type="text" @click="closeFrame"></el-button>
            <el-button v-if="currentFrameIndex !== index" size="mini" icon="el-icon-arrow-right"
            type="text" @click="editFrame(index)"></el-button>
          </div>
        </div>
        <div class="frame-dialog-content" v-if="currentFrameIndex === index">
          <item-block label="进度">
            <el-input-number :disabled="frame.percent === 100 || frame.percent === 0" size="mini" v-model="frame.percent" :step="5" :max="100" :min="0"></el-input-number>
          </item-block>
          <edit-transform v-model="frame.transform"></edit-transform>
          <edit-clip-path v-model="frame.clip"></edit-clip-path>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</div>
</template>

<script>
import './bulma-timeline.css'
import { EditTransform, EditClipPath, ItemBlock, EditLen } from '../style-editor'
import clone from 'clone'
import FRAME from './model/frame'
import cubicBeziers from './model/cubic-beziers'
import FormField from '../common/FormField'

export default {
  name: 'FramesConfig',
  props: {
    animation: {
      type: Object
    }
  },
  components: {FormField, ItemBlock, EditTransform, EditClipPath, EditLen },
  data () {
    return {
      cubicBeziers: cubicBeziers,
      activeNames: [],
      currentFrameIndex: 0,
      dialogVisible: false
    }
  },

  computed: {
    animationTypes() {
      return [{
        key: '1',
        value: '进入'
      }, {
        key: '2',
        value: '离开'
      }, {
        key: '3',
        value: '持续'
      }]
    }
  },
  watch: {
    animation: {
      deep: true,
      handler () {
        this.$emit('frame-change', this.currentFrameIndex)
      }
    }
  },
  methods: {
    appendFrame (index) {
      const newFrame = clone(FRAME)
      newFrame.percent = 50
      this.animation.frames.splice(index + 1, 0, newFrame)
      this.currentFrameIndex = index + 1
    },
    editFrame (index) {
      this.currentFrameIndex = index
    },
    removeFrame (index) {
      this.animation.frames.splice(index, 1)
      this.currentFrameIndex = index - 1
    },
    closeFrame () {
      this.currentFrameIndex = -1
    }
  }
}
</script>

<style lang="scss">
.field-body {
  flex-grow: 4;
}
.animation-config {
  .el-timeline {
    padding-left: 5px;
    .el-timeline-item__wrapper {
      padding-left: 12px;
    }
  }
  .time-line-item {
    text-align: left;
  }
  .button-percent {
    color: #999;
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
