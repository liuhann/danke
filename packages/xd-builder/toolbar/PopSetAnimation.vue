<template>
<el-popover
  placement="bottom-start"
  visible-arrow
  popper-class="toolbar-pop"
  width="400"
  trigger="click">
  <a class="action" slot="reference" title="特效">
    <IconEffect/>
  </a>
  <div id="animation-config">
    <div class="element-animation" v-show="!showAnimationChoose">
      <div class="type-title">
        <span>进入动画</span>
        <el-button size="mini" type="primary" @click="openAnimationChoose('enter')">增加</el-button>
      </div>
      <div class="empty" v-if="!element.animation.enter || element.animation.enter.length === 0"></div>
      <div class="list" v-if="element.animation.enter && element.animation.enter.length">
        <div v-for="(animation, index) in element.animation.enter" :key="index">
          <div class="animation-form">
            <div class="title">{{animation.title}}</div>
            <div class="config">
              <div class="line">
                <div class="delay">
                  延迟 <el-input-number size="mini" v-model="animation.range[0]" controls-position="right" :step="0.1"/> 秒
                </div>
                <div class="duration">
                  持续 <el-input-number size="mini" v-model="animation.range[1]" controls-position="right" :step="0.1"/> 秒
                </div>
              </div>
              <div class="line">
                <div class="duration">
                  次数 <el-input-number :disabled="animation.infinite" size="mini" v-model="animation.iteration" controls-position="right"/> 次
                </div>
                <div class="infinite">
                  循环 <el-checkbox v-model="animation.infinite"></el-checkbox>
                </div>
              </div>
            </div>
            <div class="right">
                <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeAnimation('enter', index)"></el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="type-title">
        <span>离开动画</span>
        <el-button size="mini" type="primary" @click="openAnimationChoose('exist')">增加</el-button>
      </div>
      <div class="empty" v-if="!element.animation.exist || element.animation.exist.length === 0"></div>
      <div class="list" v-if="element.animation.exist && element.animation.exist.length">
        <div v-for="(animation, index) in element.animation.exist" :key="index">
          <div class="animation-form">
            <div class="left">
              <div class="title">{{animation.title}}</div>
              <div class="config">
                <div class="delay">
                  延迟 <el-input-number size="mini" v-model="animation.range[0]" controls-position="right" :step="0.1"/> 秒
                </div>
                <div class="duration">
                  次数 <el-input-number :disabled="animation.infinite" size="mini" v-model="animation.iteration" controls-position="right"/>
                </div>
                <div class="infinite">
                  循环 <el-checkbox v-model="animation.infinite"></el-checkbox>
                </div>
              </div>
            </div>
            <div class="right">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeAnimation('exist', index)"></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="animations-choose" v-show="showAnimationChoose">
      <tabs v-model="type" @tab-click="typeChange">
        <tab-pane v-for="type in types" :key="type.value" :label="type.label" :name="type.value" />
      </tabs>
      <div class="type-groups">
        <div v-for="g in groups" :key="g" class="group" :class="g=== group? 'current': ''" @click="groupChange(g)">{{g}}</div>
      </div>
      <div class="animations">
        <div v-for="a in animations" :key="a.name" class="animation" :class="a.name === animation.name? 'current': ''" @click="animationChange(a)">{{a.direction}}</div>
      </div>

      <div class="animation-box">
          <img :src="CLOUD_HILL" :class="animation && animation.name"/>
          <div class="refresh"><i @click="refreshCurrent" class="el-icon-refresh-right" /></div>
      </div>
      <div >
        <el-button size="small" @click="showAnimationChoose = false">取消</el-button> <el-button type="primary" size="small" @click="addAnimation">选择</el-button>
      </div>

      <div class="animation-form">
        <div class="form-item">
          <div class="label">持续时间</div>
          <div class="field"><el-input-number size="mini" controls-position="right" :step="20" v-model="animation.duration" /></div>
        </div>
        <div class="form-item">
          <div class="label">过渡曲线</div>
          <div class="field">
            <el-select v-model="animation.timing" size="mini">
              <el-option v-for="(value, key) in cubicBeziers" :key="key" :label="key" :value="value"/>
            </el-select>
          </div>
        </div>
        <div class="form-item">
          <div class="label">延迟</div>
          <div class="field"><el-input-number v-model="animation.delay" size="mini" controls-position="right" :step="20" /></div>
        </div>
      </div>
    </div>
  </div>
</el-popover>


</template>

<script>
import cubicBeziers from '../../frames/model/cubic-beziers'
import IconEffect from './res/effects.svg'
import types from '../../frames/types'
import { TabPane, Tabs, Slider, Button, Popover, InputNumber, Select, Option, Checkbox } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import CLOUD_HILL from '../../vectors/cloud-hill.webp'
export default {
  name: 'PopSetAnimation',
  props: {
    element: {
      type: Object
    }
  },
  components: {
    [InputNumber.name]: InputNumber,
    [Popover.name]: Popover,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [Checkbox.name]: Checkbox,
    IconEffect,
    TabPane,
    Tabs
  },
  data () {
    return {
      CLOUD_HILL,
      types,
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
    elementType () {
      if (this.element.text != null) {
        return 'text'
      } else {
        return 'enter'
      }
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
  },
  methods: {
    async openAnimationChoose (type) {
      this.stage = type
      this.showAnimationChoose = true
      if (this.groups.length === 0) {
        await this.typeChange()
      }
    },
    async typeChange () {
      await this.loadTypeGroup()
      this.groupChange(this.groups[0])
    },
    async loadTypeGroup () {
      const result = await this.framedao.distinct('group', {
        type: this.type
      })
      this.groups = result
    },

    async groupChange(group) {
      this.group = group
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

    removeAnimation (type, index) {
      this.element.animation[type].splice(index, 1)
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
        range: [0, parseInt(this.animation.duration) / 1000]
      }
      if (!this.element.animation[this.stage]) {
        this.$set(this.element.animation, this.stage, [])
      }
      this.element.animation[this.stage].push(info)
      this.showAnimationChoose = false
    }
  }
}
</script>

<style lang="scss">
#animation-config {
  overflow: auto;
  .element-animation {
    .type-title {
      display: flex;
      font-size: 2rem;
      padding: .4rem;
      border-bottom: 1px solid #eee;
      span {
        flex: 1;
      }
    }
    .list {
      min-height: 160px;
      .animation-form {
        padding: 10px 0;
        margin-bottom: 10px;
        display: flex;
        .title {
          font-size: 1.5rem;
          width: 90px;
          padding: 10px;
          box-sizing: border-box;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .config {
          flex: 1;
          line-height: 30px;
          .line {
            display: flex;
            >div {
              margin-right: 10px;
            }
          }
        }
        .right {
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .el-input-number.is-controls-right .el-input__inner {
          padding-left: 5px;
          padding-right: 32px;
        }
        .el-input-number--mini {
          width: 64px;
        }
      }
    }
    .empty {
      height: 160px;
    }
  }
  .animations-choose {
    width: 400px;
    .type-groups {
      display: flex;
      flex-wrap: wrap;
      .group {
        width: 60px;
        height: 60px;
        cursor: pointer;
        border-radius: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 4px 3px;
        background-color: #efefef;
        &.current {
          background: #00c4cc;
          color: #fff;
        }
      }
      margin-bottom: 10px;
    }
    .animations {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      .animation {
        width: 25%;
        text-align: center;
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
