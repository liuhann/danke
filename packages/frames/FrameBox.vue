<template>
<div class="columns frame-box-columns">
  <div class="column is-two-thirds-tablet">
    <div class="frame-preview" :class="[previewType!=='文字'?'shadow': '']">
      <div class="buttons has-addons toggle-type">
        <span class="button is-small" v-for="ptype of previewTypes" :key="ptype" :class="previewType === ptype? 'is-selected is-info': ''" @click="previewType = ptype">{{ptype}}</span>
      </div>
      <span class="buttons has-addons edit-button" v-if="isEdit" >
        <span class="button icon-cw is-small" @click="refreshFrame"></span>
        <span class="button icon-edit is-info is-small" @click="editFrame"></span>
        <span class="button icon-trash is-danger is-small" v-if="currentAnimation.userid === user.id" @click="removeFrame"></span>
      </span>
      <div v-if="currentAnimation && previewType==='方块'" class="preview-box" :class="currentAnimation.name"></div>
      <div v-if="currentAnimation && previewType==='文字'" class="preview-text" :class="currentAnimation.name">frames@danke</div>
      <div v-if="previewType==='图片'" class="preview-box" :class="currentAnimation.name">
        <img src="http://cdn.danke.fun/res/sample1.png" width="160" height="160">
      </div>
      <span class="animation-provider" v-if="currentAnimation">From:{{currentAnimation.userid}}</span>
    </div>
  </div>
  <div class="column is-one-third-tablet column-list">
    <nav class="panel">
      <div class="panel-block">
          <p class="control">
            <router-link v-if="isEdit" to="/frame/edit" class="button icon-plus is-small is-info">创建</router-link>
          </p>
          <p class="control has-icons-right">
            <input class="input is-small" type="text" placeholder="按名称查找" v-model="searchFilter">
            <span class="icon is-small is-right">
              <i class="icon-search-outline" aria-hidden="true"></i>
            </span>
          </p>
        </div>
      <p class="panel-tabs">
        <a v-for="(type, index) in animationTypes" :key="index" @click="changeType(type)" :class="currentType === type.key? 'is-active': ''">
          <span class="icon is-small"><i :class="type.icon" aria-hidden="true"></i></span>
          {{type.value}}
        </a>
      </p>
      <a v-for="animation in animations" :key="animation.name" class="panel-block" @click="setAnimation(animation)"
         :class="currentAnimation.name === animation.name? 'is-active': ''">
        <span class="panel-icon">
          <i class='icon-left-small' aria-hidden="true"></i>
        </span>
         {{animation.desc || animation.name}}
      </a>
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
    select: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      user: this.ctx.user,
      previewType: '方块',
      previewTypes: ['方块', '文字', '图片'],
      currentType: '',
      searchFilter: '',
      currentAnimation: null,
      animations: [],
      animationTypes: [{
        key: '',
        value: '全部'
      },
      {
        key: '1',
        icon: 'icon-left-small',
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
      if (this.searchFilter) {
        query.desc = this.searchFilter
      }
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
    changeType (type) {
      this.currentType = type.key
      this.searchFilter = ''
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
  }
}

</style>
