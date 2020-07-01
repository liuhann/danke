<template>
  <pop-wrapper icon="el-icon-data-line">
    <div id="animation-config">
      <div v-show="!showAnimationChoose" class="element-animation">
        <div class="type-title">
          <span>进入动画</span>
          <el-button v-if="enterAnimationPastes" type="text" size="mini" icon="el-icon-document-checked" @click="pasteAnimation('enter')" />
          <el-button type="text" size="mini" icon="el-icon-document-copy" @click="copyAnimation('enter')" />
          <el-button type="text" size="mini" icon="el-icon-plus" @click="newFrame('enter')" />
        </div>
        <div v-if="!element.animation.enter || element.animation.enter.length === 0" class="empty">
          未设置动态效果
        </div>
        <div class="in-animation-list">
          <div v-for="(step, index) in element.animation.enter" :key="index" class="animation-entry">
            <div class="summary">
              <el-cascader v-model="step.name" size="mini" :options="CASOptions" @change="casArray => frameChange(step, casArray)">
              </el-cascader>
              <div class="duration">
              </div>
              <el-button :icon="step.edit? 'el-icon-arrow-up': 'el-icon-arrow-down'" size="mini" type="text" @click="toggleStepShow(step)" />
            </div>
            <animation-form v-show="step.edit" :animation="step" />
          </div>
        </div>
        <animation-form v-if="element.animation.enter && element.animation.enter.length" :element="element" type="enter" />
        <div class="type-title">
          <span>离开动画</span>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="openAnimationChoose('exist')" />
        </div>
        <div v-if="!element.animation.exist || element.animation.exist.length === 0" class="empty">
          未设置动态效果
        </div>
        <animation-form v-if="element.animation.exist && element.animation.exist.length" :element="element" type="exist" />
      </div>
      <div v-show="showAnimationChoose" class="animations-choose">
        <div class="animation-category">
          <el-select v-model="type" size="mini" @change="typeChange">
            <el-option v-for="t in types" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
          <el-select v-model="group" size="mini" @change="groupChange">
            <el-option v-for="g in groups" :key="g" :label="g" :value="g" />
          </el-select>
        </div>
        <div class="animations">
          <div v-for="a in animations" :key="a.name" class="animation" :class="a.name === animation.name? 'current': ''" @click="animationChange(a)">
            {{ a.direction }}
          </div>
        </div>
        <div class="animation-box">
          <img :src="CLOUD_HILL" :class="animation && animation.name">
          <div class="refresh">
            <i class="el-icon-refresh-right" @click="refreshCurrent" />
          </div>
        </div>
        <div>
          <el-button size="small" @click="showAnimationChoose = false">
            取消
          </el-button> <el-button type="primary" size="small" @click="addAnimation">
            选择
          </el-button>
        </div>
      </div>
    </div>
  </pop-wrapper>
</template>

<script>
import cubicBeziers from '../../frames/model/cubic-beziers'
import types from '../../frames/types'
import toolbarPopMixin from './toolbarPopMixin'
import RestDAO from '../../utils/restdao.js'
import CLOUD_HILL from '../../vectors/cloud-hill.webp'
import AnimationForm from './AnimationForm.vue'


function foundInArray(array, key, value) {
  const filtered = array.filter(i => i[key] === value)
  if (filtered.length) {
    return filtered[0]
  } else {
    return null
  }
}

export default {
  name: 'PopSetAnimation',
  components: {
    AnimationForm
  },
  mixins: [ toolbarPopMixin ],
  data () {
    return {
      allFrames: [],
      CLOUD_HILL,
      types,
      stage: '',
      cubicBeziers,
      type: 'basic',
      showAnimationChoose: false,
      group: '',
      groups: [],
      animation: {},
      animations: []
    }
  },
  computed: {
    CASOptions () {
      const all = JSON.parse(JSON.stringify(types))
      for (let frame of this.allFrames.filter(f => f.group && f.type)) {
        let type = foundInArray(all, 'value', frame.type)
        if (!type) {
          type = {
            value: frame.type,
            label: frame.type,
            children: []
          }
          all.push(type)
        }
        
        if (!type.children) {
          type.children = []
        }
        let group = foundInArray(type.children, 'value', frame.group)
        if (!group) {
            group = {
              value: frame.group,
              label: frame.group,
              children: []
            }
            type.children.push(group)
        }
        group.children.push({
          value: frame.name,
          label: frame.direction,
          frame
        })
      }
      return all
    },
    elementType () {
      if (this.element.text != null) {
        return 'text'
      } else {
        return 'enter'
      }
    },
    enterAnimationPastes () {
      return this.ctx['animation-enter']
    },
    existAnimationPastes () {
      return this.ctx['animation-enter']
    },
    enterAnimations () {
      return this.element.animation.enters || []
    },
    existAnimations () {
      return this.element.animation.exists || []
    }
  },
  created () {
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },
  mounted () {
    this.loadAllFrames()
  },
  methods: {
    async loadAllFrames () {
      const result = await this.framedao.list({
        count: 1000
      })
      this.allFrames = result.list
    },
    async openAnimationChoose (type) {
      this.stage = type
      this.showAnimationChoose = true
      if (this.groups.length === 0) {
        await this.typeChange()
      }
    },
    async typeChange () {
      await this.loadTypeGroup()
      this.group = this.groups[0]
      this.groupChange()
    },
    async loadTypeGroup () {
      const result = await this.framedao.distinct('group', {
        type: this.type
      })
      this.groups = result
    },

    async groupChange() {
      await this.loadGroupAnimations()
      if (this.animations.length) {
        this.animation = this.animations[0]
        this.ctx.styleRegistry.addFrame(this.animation)
      }
    },

    async loadGroupAnimations () {
      const result = await this.framedao.list({
        type: this.type,
        group: this.group
      })
      this.animations = result.list
    },

    refreshCurrent () {
      const replayStore = this.animation.name
      this.animation.name = ''
      setTimeout(() => {
        this.animation.name = replayStore
      }, 200)
    },

    animationChange (animation) {
      this.animation = animation
      this.animation.delay = 0
      this.ctx.styleRegistry.addFrame(this.animation)
    },

    pasteAnimation (type) {
      this.$set(this.element.animation, type, JSON.parse(JSON.stringify(this.ctx['animation-' + type])))
    },

    copyAnimation (type) {
      this.$set(this.ctx, 'animation-' + type, JSON.parse(JSON.stringify(this.element.animation[type])))
    },

    frameChange (step, value) {
      const frame = this.allFrames.filter(f => f.name === value[2])[0]
      step.name = frame.name
      step.variables = frame.variables
    },

    changeFrame (step, frame) {
      step.name = frame.name
      step.timing = frame.timing
      step.iteration = frame.iteration
      step.infinite = frame.infinite
      step.range = [0, parseInt(frame.duration) / 1000]
      step.variables = frame.variables || []
    },

    newFrame (stage) {
      const step = {}

      const frame = this.allFrames.filter(f => f.name === '')[0]
      step.name = frame.name
      step.timing = frame.timing
      step.iteration = frame.iteration
      step.infinite = frame.infinite
      step.range = [0, parseInt(frame.duration) / 1000]
      step.variables = frame.variables || []

      this.changeFrame(info, this.allFrames[0])
      if (!this.element.animation[stage]) {
        this.$set(this.element.animation, stage, [])
      }
      this.element.animation[stage].push(info)
    },

    toggleStepShow (step) {
      this.$set(step, 'edit', !step.edit)
    },
    // 增加动画
    addAnimation () {
      const info = {
        // 名称，供配置展示用
        title: this.animation.direction + this.animation.group,
        // css类名称
        name: this.animation.name,
        // 过渡函数，默认不许修改
        timing: this.animation.timing,
        iteration: this.animation.iteration,
        // 无限循环
        infinite: this.animation.infinite || false,
        // 时间区间 [0]为延迟，[1]为持续时间
        range: [0, parseInt(this.animation.duration) / 1000],
        variables: this.animation.variables
      }
      if (!this.element.animation[this.stage]) {
        this.$set(this.element.animation, this.stage, [])
      }
      this.element.animation[this.stage].push(JSON.parse(JSON.stringify(info)))
      this.showAnimationChoose = false
    }
  }
}
</script>

<style lang="scss">
#animation-config {
  overflow: auto;

  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 5px;
    padding-right: 32px;
  }
  .el-input-number--mini {
    width: 64px;
  }

  .animation-entry {
    .summary {
      padding: 5px 10px;
      display: flex;
      line-height: 36px;
    }
    .duration {
      flex: 1;
    }
  }
  .element-animation {
    .type-title {
      display: flex;
      font-size: 1.5rem;
      padding: .4rem;
      border-bottom: 1px solid #eee;
      line-height: 30px;
      span {
        flex: 1;
      }
    }
    .empty {
      height: 160px;
      color: #999999;
      font-size: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .animations-choose {
    width: 400px;
    .animation-category {
      display: flex;
      margin: 8px 0;
    }
    .animations {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      .animation {
        text-align: center;
        float: left;
        padding: 0 10px;
        line-height: 32px;
        cursor: pointer;
        &.current {
          background: #00c4cc;
          color: #fff;
        }
      }
    }

    .animation-box {
      height: 160px;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fafafa;
      position: relative;
      overflow: hidden;
      perspective: 160px;
      img {
        width: 160px;
        height: 100px;
      }
      .refresh {
        position: absolute;
        right: 10px;
        top: 10px;
        i {
          font-size: 22px;
        }
      }
    }

    .selected-animations {
      padding: 0 12px;
      width: 100%;
      .animation {
        .animation-name {
          width: 90px;
        }
        .el-input-number--mini {
          width: 90px;
        }
        .el-input-number.is-controls-right .el-input__inner {
          padding-left: 5px;
          padding-right: 28px;
        }
        .duration {
          flex: 1;
        }
        .icon-del {
          width: 36px;
          text-align: right;
        }
      }
    }
  }

}
</style>
