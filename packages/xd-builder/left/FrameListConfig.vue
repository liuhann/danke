<template>
  <div>
    <div class="pop-title">
      <span class="text">动态效果</span>
      <a class="btn-close" @click="$emit('close')"><i class="el-icon-circle-close" /></a>
    </div>
    <div v-if="element" class="animation-config">
      <el-tabs v-model="animationType" type="card" size="mini">
        <el-tab-pane label="进入" name="enter" />
        <el-tab-pane label="离开" name="exist" />
      </el-tabs>
      <div v-for="(step, index) in element.animation[animationType]" :key="index" class="animation-entry">
        <div class="summary">
          <div class="title">
            #{{ index + 1 }} {{ step.group }} - {{ step.direction }}
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
        <el-tabs v-model="group" tab-position="left" style="height: 100%;" @tab-click="groupChange">
          <el-tab-pane v-for="g in groups" :key="g" :label="g" :name="g" />
        </el-tabs>
        <div class="frames-container">
          <div v-for="(frame, index) in frames" :key="index" class="frame" :class="currentFrame.name === frame.name ? 'current': ''" @click="selectFrame(frame)">
            {{ frame.direction }}
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
import { Pagination, Input, Button, Loading, Checkbox, Tabs, TabPane, Collapse, CollapseItem } from 'element-ui'

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
      animation: {},
      currentFrame: {},
      groups: [],
      frames: []
    }
  },
  created () {
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },
  mounted () {
    this.loadGroups ()
    this.currentAlbum = '基础'
  },
  methods: {
    async loadGroups () {
       this.groups = await this.framedao.distinct('group')
       this.group = this.groups[0]
       this.groupChange()
    },
   
    selectFrame (frame) {
      this.currentFrame = frame
      this.$set(this.element, 'previewAnimation', [this.getFrameStep(frame)])
      // clear preview
      setTimeout(() => {
        this.$set(this.element, 'previewAnimation', [])
      }, parseInt(frame.duration) + 200)
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
    const currentFrame = JSON.parse(JSON.stringify(this.element.animation[this.animationType]))
    this.$set(this.element, 'previewAnimation', [])
    // this.element.animation[this.animationType] = []
    console.log('preview', currentFrame)
    setTimeout(() => {
      this.$set(this.element, 'previewAnimation', currentFrame)
      // this.element.animation[this.animationType] = currentFrame
    }, 100)

  },

  confirmFrame () {
    if (this.currentStep) {
      this.currentStep.name = this.currentFrame.name
      this.currentStep.group = this.currentFrame.group
      this.currentStep.direction = this.currentFrame.direction
      this.currentStep.variables = JSON.parse(JSON.stringify(this.currentFrame.variables || []))
    } else {
      const step = this.getFrameStep(this.currentFrame)

      if (!this.element.animation[this.animationType]) {
        this.$set(this.element.animation, this.animationType, [])
      }
      this.element.animation[this.animationType].push(JSON.parse(JSON.stringify(step)))
    }
    this.showChoose = false
  },

  getFrameStep(frame) {
    const step = {}
    step.name = frame.name
    step.group = frame.group
    step.direction = frame.direction
    step.timing = frame.timing
    step.iteration = frame.iteration
    step.infinite = frame.infinite
    step.range = [0, parseInt(frame.duration) / 1000]
    step.variables = frame.variables || []
    return step
  },

  async groupChange () {
      this.frames = (await this.framedao.list({
        group: this.group
      })).list
      if (this.frames.length) {
        this.handleCurrentChange(this.frames[0])
      }
    },
    handleCurrentChange (val) {
      if (val) {
        this.ctx.styleRegistry.addFrame(val)
        this.animation = val
        this.animation.delay = 0
      }
    }
  }
}
</script>

<style lang="scss">
#left-frames-config {
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
      padding-left: 1rem;
      .frame {
        padding: 10px 5px;
        font-size: 1.5rem;
        color: #999;
        cursor: pointer;
        &:hover {
          background: rgba(153, 169, 191, .3);
        }
        &.current {
          background: #eee;
          color: rgb(84, 103, 131);
        }
      }
    }
  }
  .animation-config {
    overflow-y: auto;
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