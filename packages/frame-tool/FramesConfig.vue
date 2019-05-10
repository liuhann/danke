<template>
<div class="animation-config box">
  <div class="frames">
    <form-field v-model="animation.name" label="动画名称" type="text">
    </form-field>
    <form-field v-model="animation.desc" label="描述" type="text">
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
              <a v-if="currentFrameIndex !== index" class="icon-right-open" @click="editFrame(index)">编辑</a>
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
    </div>
  </div>
</div>
</template>

<script>
import './bulma-timeline.css'
import { EditTransform, EditClipPath, ItemBlock, EditLen } from '../style-tool/exports.js'
import { clone } from '../utils/object'
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
  .level {
    display: flex;
    .level-right {
      margin: 0;
    }
  }
}
</style>
