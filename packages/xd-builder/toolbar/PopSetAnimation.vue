<template>
<pop-wrapper :width="400" icon="el-icon-data-line">
  <div id="animation-config">
    <div class="element-animation" v-show="!showAnimationChoose">
      <div class="type-title">
        <span>进入动画</span>
        <el-button type="text" size="mini" v-if="enterAnimationPastes" @click="pasteAnimation('enter')" icon="el-icon-document-checked" />
        <el-button type="text" size="mini" @click="copyAnimation('enter')" icon="el-icon-document-copy" />
        <el-button type="text" size="mini" @click="openAnimationChoose('enter')" icon="el-icon-plus" />
      </div>
      <div class="empty" v-if="!element.animation.enter || element.animation.enter.length === 0">未设置动态效果</div>
      <animation-form v-if="element.animation.enter && element.animation.enter.length" :element="element" type="enter"></animation-form>
      <div class="type-title">
        <span>离开动画</span>
        <el-button size="mini" type="text" @click="openAnimationChoose('exist')" icon="el-icon-plus" />
      </div>
      <div class="empty" v-if="!element.animation.exist || element.animation.exist.length === 0">未设置动态效果</div>
      <animation-form v-if="element.animation.exist && element.animation.exist.length" :element="element" type="exist"></animation-form>
    </div>
    <div class="animations-choose" v-show="showAnimationChoose">
      <el-tabs v-model="type" @tab-click="typeChange">
        <el-tab-pane v-for="type in types" :key="type.value" :label="type.label" :name="type.value" />
      </el-tabs>
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
    </div>
  </div>
</pop-wrapper>
</template>

<script>
import cubicBeziers from '../../frames/model/cubic-beziers'
import toolbarPopMixin from './toolbarPopMixin'
import types from '../../frames/types'
import RestDAO from '../../common/dao/restdao'
import CLOUD_HILL from '../../vectors/cloud-hill.webp'
import AnimationForm from './AnimationForm'
export default {
  name: 'PopSetAnimation',
  mixins: [ toolbarPopMixin ],
  components: {
    AnimationForm
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

    pasteAnimation (type) {
      this.$set(this.element.animation, type, JSON.parse(JSON.stringify(this.ctx['animation-' + type])))
    },

    copyAnimation (type) {
      this.$set(this.ctx, 'animation-' + type, JSON.parse(JSON.stringify(this.element.animation[type])))
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
