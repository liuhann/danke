<template>
<div class="animation-config box">
  <div class="frames">
    <div class="field has-addons">
      <div class="control field-lb">
        名称
      </div>
      <div class="control">
        <input class="input is-small" v-model="animation.name">
      </div>
    </div>
    <div class="field has-addons">
      <div class="control field-lb">
        描述
      </div>
      <div class="control">
        <input class="input is-small" style="width: 200px;" v-model="animation.desc">
      </div>
    </div>
    <div class="field has-addons">
      <div class="control field-lb">
        类型
      </div>
      <div class="control">
        <div class="select is-small">
          <select v-model="animation.type">
            <option v-for="option in animationTypes" :value="option.key" :key="option.key">{{option.value}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="tags" style="margin-bottom: .5rem;">
      <span class="tag is-light" v-for="key in currentKeyWords" :key="key.en" @click="addKeyWord(key.en, key.zh)">{{key.zh}}</span>
    </div>
    <div class="field has-addons">
      <div class="control field-lb">
        时长
      </div>
      <div class="control">
        <input class="input is-small" style="width: 80px;" type="number" v-model="animation.duration">
      </div>
      <div class="control">
        <a class="button is-static is-small">ms</a>
      </div>
    </div>
    <div class="field has-addons">
      <div class="control field-lb">
        过渡曲线
      </div>
      <div class="control">
        <div class="select is-small">
          <select v-model="animation.timing">
            <option v-for="(value, key) of cubicBeziers" :value="key" :key="key">{{key}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field has-addons" v-if="editMode === 'css'">
      <div class="control field-lb">
        动画CSS
      </div>
    </div>
    <div class="field has-addons" style="height: 220px;" v-if="editMode === 'css'"> 
      <textarea v-model="animation.cssFrame" style="width: 100%; height: 200px;"></textarea>
    </div>

    <div class="timeline" v-if="editMode === 'timeline'">
      <div class="timeline-item"
           v-for="(frame, index) in animation.frames" :key="index">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="heading level">
            <div class="level-left is-small">{{frame.percent}}%</div>
            <div class="level-right is-small">
              <a v-if="frame.percent !== 100" class="icon-plus-1" @click="appendFrame(index)"></a>
              <a v-if="!(frame.percent === 100 || frame.percent === 0)" class="icon-trash-empty" @click="removeFrame(index)"></a>
              <a v-if="currentFrameIndex === index" class="icon-angle-up" @click="closeFrame"></a>
              <a v-if="currentFrameIndex !== index" class="icon-angle-down" @click="editFrame(index)"></a>
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

    <div class="field has-addons">
      <a class="button is-success is-small" v-if="editMode === 'timeline'" @click="editMode='css'">源代码编辑</a>  
      <a class="button is-success is-small" v-if="editMode === 'css'" @click="editMode='timeline';animation.cssFrame=''">时间线编辑</a>  
    </div>

  </div>
</div>
</template>

<script>
import './bulma-timeline.css'
import EditTransform from '../xd-builder/components/props/EditTransform.vue'
import EditClipPath from '../xd-builder/components/props/EditClipPath'
import EditLen from '../xd-builder/components/props/EditLen'
import FormField from '../xd-builder/components/props/FormField.vue'
import { clone } from '../utils/object'
import FRAME from './model/frame'
import cubicBeziers from './model/cubic-beziers.js'
import animationTypes from './model/animation-type.js'
export default {
  name: 'FramesConfig',
  props: {
    animation: {
      type: Object
    },
    isEdit: {
      type: Boolean
    }
  },
  components: { FormField, EditTransform, EditClipPath, EditLen },
  data () {
    return {
      animationTypes,
      cubicBeziers,
      activeNames: [],
      currentFrameIndex: 0,
      editMode: 'timeline',
      dialogVisible: false
    }
  },
  computed: {
    currentKeyWords: function () {
      for (let animation of animationTypes) {
        if (this.animation.type === animation.key) {
          return animation.keyword
        }
      }
      return []
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
    addKeyWord (en, zh) {
      this.animation.name += en + '-'
      this.animation.desc += zh
    },
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
  .field {
    display: flex;
    .field-label {
      margin-right: .5rem;
      width: 48px;
      flex: initial;
      text-align: right;
      label {
        color: #888;
        font-weight: normal;
      }
    }
  }
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
