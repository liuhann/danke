<template>
<div class="columns frame-box-columns is-gapless">
  <div class="column preview">
    <div class="frame-preview" :class="[previewType!=='文字'?'shadow': '']">
      <span class="buttons has-addons edit-button" v-if="isEdit" >
        <router-link to="/frame/edit" class="button is-small is-info">创建</router-link>
        <span class="button is-small" @click="editFrame">编辑</span>
        <span class="button is-danger is-small" v-if="currentAnimation && currentAnimation.userid === user.id" @click="removeFrame">删除</span>
      </span>
      <div v-if="currentAnimation && previewType==='rect'" class="preview-box" :class="currentAnimation.name"></div>
      <div v-if="currentAnimation && previewType==='text'" class="preview-text" :class="currentAnimation.name">frames@danke</div>
    </div>
  </div>
  <div class="column is-narrow-tablet frame-navigation">
    <div class="tabs is-small" style="margin: .5rem 0 0;">
      <ul>
        <li v-for="(type, index) in animationTypes" :key="index" :class="currentType === type.key? 'is-active': ''">
          <a @click="changeType(type)" >{{type.value}}</a>
        </li>
      </ul>
    </div>
    <nav class="panel frames-list">
      <div class="panel-body">
        <div class="animations">
          <div v-for="animation in filteredAnimations" :key="animation.name" class="animation" @click="setAnimation(animation)"
             :class="currentAnimation.name === animation.name? 'is-active': ''">
            <div class="zh-name">{{animation.desc}}</div>
            <div class="en-name">{{animation.name}}</div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao'
import { Message } from 'element-ui'
import { addAnimationStyle, createSheet } from './keyframe'
import animationTypes from './model/animation-type.js'
export default {
  name: 'FrameBox',
  components: {
  },
  props: {
    isEdit: {
      type: Boolean
    },
    height: {
      default: 420
    },
    previewType: {
      type: String,
      default: 'rect'
    },
    select: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      animationSet: {},
      user: this.ctx.user,
      previewTypes: ['方块', '文字', '图片'],
      currentType: 'in',
      currentAnimation: null,
      animations: [],
      currentKeyWords: [],
      filterKey: '',
      animationTypes
    }
  },
  computed: {
    filteredAnimations () {
      return this.animations.filter(animation => animation.name.indexOf(this.filterKey) > -1)
    }
  },
  created () {
    this.sheet = createSheet()
    this.restdao = new RestDAO(this.ctx, 'danke/animation')
    this.changeType(this.animationTypes[0])
  },
  methods: {
    setAnimation (animation) {
      addAnimationStyle(this.sheet, animation)
      this.currentAnimation = animation
      this.animationSet[this.currentType] = animation
    },
    async loadAnimation () {
      const query = {}
      if (this.currentType) {
        query.type = this.currentType
      }
      query.count = 10000
      const response = await this.restdao.list(query)
      this.animations = response.list
      if (this.animations.length) {
        this.currentAnimation = this.animations[0]
      }
    },
    refreshFrame () {

    },

    async removeFrame () {
      await this.restdao.delete(this.currentAnimation)
      await this.loadAnimation()
      Message.success('删除成功')
    },

    editFrame () {
      this.ctx.editAnimation = this.currentAnimation
      this.$router.push('/frame/edit')
    },
    filter (key) {
      this.filterKey = key
    },
    changeType (type) {
      this.currentType = type.key
      this.currentKeyWords = this.animationTypes.filter(at => at.key === type.key)[0].keyword
      this.filterKey = ''
      this.loadAnimation()
    }
  }
}
</script>


<style lang="scss">
.frame-box-columns {
  height: 100%;
}
.frame-preview {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  &.shadow {
    background-image: linear-gradient(90deg, #592D2D, #592D2D);
    background-size: 160px 160px;
    background-position: center;
    background-repeat: no-repeat;
  }

  .toggle-type {
    position: absolute;
    left: .3rem;
    top: .3rem;
  }
  .preview-text {
    font-size: 2rem;
  }
  .edit-button {
    position: absolute;
    top: .3rem;
    right: .3rem;
  }
  .preview-box {
    width: 160px;
    height: 160px;
    background-color: #FF4B4B;
  }
  .animation-provider {
    position: absolute;
    right: .5rem;
    bottom: .5rem;
    color: #999;
    font-size: 12px;
  }
}

.frames-list {
  width: 320px;
  height: calc(100% - 40px);
  overflow: auto;
  .panel-body {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid #eee;
  }
  .animations {
    width: 100%;
    .animation {
      cursor: pointer;
      &:hover {
        background: #fefefe;
      }
      &.is-active {
        background-color: #eee;
      }
      border-bottom: 1px solid #eee;
      padding: 4px 10px;
      .en-name {
        color: #666;
      }
    }
  }
}
.frame-box-columns {
  .panel {
    font-size: 12px;
  }
}
@media screen and (max-width: 640px) {
  .el-dialog__body {
    padding: 10px;
  }
  .frames-list {
    width: 100%;
  }
  .column.preview {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
  }
  .frame-preview {
    margin: 10px;
    height: 80px;
    width: 80px;
    background-image: linear-gradient(90deg, #592D2D, #592D2D);
    .preview-box {
      width: 80px;
      height: 80px;
      background-color: #FF4B4B;
    }
  }
}

</style>
