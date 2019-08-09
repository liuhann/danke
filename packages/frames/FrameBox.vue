<template>
<div class="columns frame-box-columns">
  <div class="column">
    <div class="frame-preview" :class="[previewType!=='文字'?'shadow': '']">
      <span class="buttons has-addons edit-button" v-if="isEdit" >
        <span class="button icon-cw is-small" @click="refreshFrame">刷新</span>
        <span class="button icon-edit is-info is-small" @click="editFrame">编辑</span>
        <span class="button icon-trash is-danger is-small" v-if="currentAnimation.userid === user.id" @click="removeFrame">删除</span>
      </span>
      <div v-if="currentAnimation && previewType==='rect'" class="preview-box" :class="currentAnimation.name"></div>
      <div v-if="currentAnimation && previewType==='text'" class="preview-text" :class="currentAnimation.name">frames@danke</div>
    </div>
  </div>
  <div class="column is-narrow-tablet frame-navigation">
    <div class="tabs" style="margin-bottom: .5rem;">
      <ul>
        <li v-for="(type, index) in animationTypes" :key="index" :class="currentType === type.key? 'is-active': ''">
          <a @click="changeType(type)" >{{type.value}}</a>
        </li>
      </ul>
    </div>
    <div class="tags" style="margin-bottom: .5rem;">
      <span class="tag is-light" :class="[key.en === filterKey? 'is-info': '']" v-for="key in currentKeyWords" :key="key.en" @click="filter(key.en)">{{key.zh}}</span>
    </div>

    <nav class="panel frames-list">
      <div class="panel-block" v-if="isEdit">
          <p class="control">
            <router-link to="/frame/edit" class="button icon-plus is-small is-info">创建</router-link>
          </p>
        </div>
      <div class="panel-body">
        <div class="animations">
          <div v-for="animation in filteredAnimations" :key="animation.name" class="animation" @click="setAnimation(animation)"
             :class="currentAnimation.name === animation.name? 'is-active': ''">
            <div class="en-name">{{animation.name}}</div>
            <div class="zh-name">{{animation.desc}}</div>
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
export default {
  name: 'FrameBox',
  props: {
    isEdit: {
      type: Boolean
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
      user: this.ctx.user,
      previewTypes: ['方块', '文字', '图片'],
      currentType: '1',
      currentAnimation: null,
      animations: [],
      currentKeyWords: [],
      filterKey: '',
      animationTypes: [{
        key: '1',
        icon: 'icon-left-small',
        keywords: [{
          en: 'fade',
          zh: '淡入'
        }, {
          en: 'flip',
          zh: '翻转'
        }, {
          en: 'crop',
          zh: '裁切'
        }, {
          en: 'scale',
          zh: '缩放'
        }, {
          en: 'rotate',
          zh: '旋转'
        }, {
          en: 'rotate1',
          zh: '旋转1'
        }],
        value: '进入'
      }, {
        key: '2',
        value: '离开',
        keywords: [{
          en: 'fade',
          zh: '淡出'
        }, {
          en: 'flip',
          zh: '翻转'
        }, {
          en: 'crop',
          zh: '裁切'
        }, {
          en: 'scale',
          zh: '缩放'
        }, {
          en: 'rotate',
          zh: '旋转'
        }]
      }, {
        key: '3',
        value: '持续',
        keywords: [{
          en: 'fade',
          zh: '淡入'
        }, {
          en: 'flip',
          zh: '翻转'
        }, {
          en: 'crop',
          zh: '裁切'
        }, {
          en: 'scale',
          zh: '缩放'
        }, {
          en: 'rotate',
          zh: '旋转'
        }]
      }]
    }
  },
  computed: {
    filteredAnimations () {
      return this.animations.filter( animation => animation.name.indexOf(this.filterKey) > -1)
    }
  },
  created () {
    this.sheet = createSheet()
    this.restdao = new RestDAO(this.ctx, 'danke/animation')
    this.loadAnimation()
  },
  methods: {
    setAnimation (animation) {
      addAnimationStyle(this.sheet, animation)
      this.currentAnimation = animation
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
      this.$router.push('/frames')
    },


    filter (key) {
      this.filterKey = key
    },

    changeType (type) {
      this.currentType = type.key
      this.currentKeyWords = this.animationTypes.filter(at => at.key === type.key)[0].keywords
      this.filterKey = ''
      this.loadAnimation()
    }
  }
}
</script>


<style lang="scss">
  .frame-preview {
    min-height: 400px;
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
    .panel-body {
      width: 100%;
      height: 420px;
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px solid #eee;
    }
    .animations {
      width: 100%;
      .animation {
        cursor: pointer;
        &:hover {
          background: #efefef;
        }
        &.is-active {
          background-color: #209cee;
          color: #fff;
        }
        display: inline-block;
        border: 1px solid #eee;
        padding: 8px;
        margin: 5px;
        .en-name {
          font-size: 14px;
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
    .frame-preview {
      height: 80vw;
      .preview-box {
        width: 30vw;
        height: 30vw;
        background-color: #FF4B4B;
      }
      .frames-list {
        width: 100vw;
      }
    }
  }

</style>
