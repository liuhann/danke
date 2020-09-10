<template>
  <div id="left-frames-config" class="drawer_content">
    <div class="pop-title">
      <div class="frame-tab">
        <div>动画效果：</div>
        <div :class="animationType === 'enter'? 'selected': ''" class="tab" @click="animationType = 'enter'">进入</div>
        <div :class="animationType === 'exit'? 'selected': ''" class="tab" @click="animationType = 'exit'">离开</div>
      </div>
      <a class="btn-close" @click="$emit('close')"><i class="el-icon-circle-close" /></a>
    </div>
    <div v-if="element" class="animation-config">
      <div v-if="element.animation[animationType] == null || element.animation[animationType].length === 0" class="empty">未设置动画</div>
      <div v-for="(step, index) in element.animation[animationType]" :key="index" class="animation-entry">
        <div class="summary">
          <div class="title">
            #{{ index + 1 }} {{ step.name }}
          </div>
          <i class="el-icon-edit-outline" @click="replaceFrame(step)">重新选择</i>
          <i class="el-icon-delete" @click="deleteFrame(index)" />
        </div>
        <animation-form :animation="step" />
      </div>
      <el-button size="mini" type="success" @click="addFrame">增加</el-button>
      <el-button size="mini" type="warn" @click="previewFrames">预览</el-button>
    </div>

    <div v-show="showChoose && element" class="animation-choose">
      <div class="action">
        <el-button size="mini" type="success" @click="confirmFrame">确认</el-button>
        <el-button size="mini" @click="showChoose = false">取消</el-button>
      </div>
      <div class="hor-tabs">
        <el-tabs v-model="root" tab-position="left" style="height: 100%;" @tab-click="rootChange">
          <el-tab-pane v-for="g in roots" :key="g" :label="g" :name="g" />
        </el-tabs>
        <el-tabs v-model="group" tab-position="left" style="height: 100%;" @tab-click="groupChange">
          <el-tab-pane v-for="g in groups" :key="g" :label="g" :name="g" />
        </el-tabs>
        <div class="frames-container">
          <div v-for="(frame, key) in frames" :key="key" class="frame" :class="currentFrame.name === key ? 'current': ''" @click="selectFrame(key)">
            {{ key }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao.js'
import { assignVariables } from '../mixins/renderUtils'
import AnimationForm from './AnimationForm.vue'
import { getRoots, getSubGroup, getGroupAnimations } from '../../animista/animistaFetched'

export default {
  name: 'FrameListConfig',
  components: {
    AnimationForm
  },
  props: {
    element: {
      type: Object
    }
  },
  data () {
    return {
      animationType: 'enter',
      showChoose: false,
      currentStep: null,
      group: '',
      roots: getRoots(),
      root: getRoots()[0],
      animation: {},
      currentFrame: {},
      groups: [],
      frames: {}
    }
  },
  created () {
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },
  mounted () {
    this.rootChange ()
    // this.loadGroups ()
  },
  methods: {
    rootChange () {
      this.groups = getSubGroup(this.root)
      this.group = this.groups[0]
      this.frames = getGroupAnimations(this.root, this.group)
    },
    async groupChange () {
      this.frames = getGroupAnimations(this.root, this.group)
    },
    async loadGroups () {
       this.groups = await this.framedao.distinct('group')
       this.group = this.groups[0]
       this.groupChange()
    },

    selectFrame (key) {
      this.currentFrame = Object.assign({}, this.frames[key], {
        name: key
      })
      this.element.animation.preview = [Object.assign({}, this.currentFrame)]
      // clear preview
      setTimeout(() => {
        this.element.animation.preview = null
      }, (parseInt(this.currentFrame.duration) * 1000) + 2000)
    },

    addFrame () {
      this.currentStep = null
      this.showChoose = true
    },

    replaceFrame (step) {
     this.currentStep = step
     this.showChoose = true
    },

    deleteFrame (index) {
      this.element.animation[this.animationType].splice(index, 1)
    },

    previewFrames () {
      this.element.animation.preview = this.element.animation[this.animationType]
    },

    confirmFrame () {
      if (this.currentStep) {
        this.currentStep = Object.assign({}, this.currentFrame)
      } else {
        this.element.animation[this.animationType].push(Object.assign({}, this.currentFrame))
      }
      this.showChoose = false
    },

    getFrameStep(frame) {
      const step = {}
      step.name = frame.name
      step.easing = frame.easing
      step.easing = frame.easing
      step.easing = frame.easing
      step.iteration = frame.iterationCount
      step.infinite = frame.iterationCount === 'infinite' ? true : false
      step.range = [0, frame.duration]
      return step
    },

    handleCurrentChange (val) {
      if (val) {
        this.animation = val
        this.animation.delay = 0
      }
    }
  }
}
</script>

<style lang="scss">
#left-frames-config {
  .frame-tab {
    flex: 1;
    display: flex;
    .tab {
      cursor: pointer;
      margin: 0 20px;
      padding-bottom: 5px;
      &.selected {
        border-bottom: 2px solid #00bf72;
        color: #00bf72;
      }
    }
  }
  .no-element {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.75rem;
    color: #999;
  }
  .animation-choose {
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    bottom: 0;
    background: #fff;
    z-index: 99;
    .action {
      padding: 1rem;
      text-align: right;
      border-bottom: 1px solid #efefef;
    }
    .hor-tabs {
      display: flex;
      height: calc(100% - 50px);
    }
    .frames-container {
      .action {
        text-align: right;
        padding: 8px;
      }
      height: calc(100vh - 40px);
      flex: 1;
      background: #fff;
      overflow-y: auto;
      .frame {
        padding: 10px 5px;
        font-size: 1.5rem;
        color: #999;
        cursor: pointer;
        &:hover {
          color: #409EFF;
        }
        &.current {
          color: #409EFF;
        }
      }
    }
  }
  .animation-config {
    overflow-y: auto;
    margin: 10px;
    .animation-entry {
      .summary {
        display: flex;
        padding: 0 10px;
        color:rgba(153, 169, 191, .8);
        .title {
          flex: 1;
        }
        .el-icon-delete, .el-icon-edit-outline {
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 3px;
          &:hover {
            background-color: rgba(153, 169, 191, .2);
          }
        }
      }
    }
  }

}
</style>
