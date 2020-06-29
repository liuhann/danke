<template>
  <pop-wrapper icon="el-icon-data-line">
    <div id="animation-config">
      <div v-show="!showAnimationChoose" class="element-animation">
        <div class="type-title">
          <span>进入动画</span>
          <el-button v-if="enterAnimationPastes" type="text" size="mini" icon="el-icon-document-checked" @click="pasteAnimation('enter')" />
          <el-button type="text" size="mini" icon="el-icon-document-copy" @click="copyAnimation('enter')" />
          <el-button type="text" size="mini" icon="el-icon-plus" @click="openAnimationChoose('enter')" />
        </div>
        <div v-if="!element.animation.enter || element.animation.enter.length === 0" class="empty">
          未设置动态效果
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
            <el-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value" />
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
import toolbarPopMixin from './toolbarPopMixin'
import types from '../../frames/types'
import RestDAO from '../../utils/restdao.js'
import CLOUD_HILL from '../../vectors/cloud-hill.webp'
import AnimationForm from './AnimationForm.vue'
export default {
  name: 'PopSetAnimation',
  components: {
    AnimationForm
  },
  mixins: [ toolbarPopMixin ],
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
