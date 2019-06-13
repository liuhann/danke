<template>
<div class="columns frame-box-columns">
  <div class="column is-two-thirds-tablet">
    <div class="frame-preview">
      <div class="buttons has-addons toggle-type">
        <span class="button" v-for="ptype of previewTypes" :key="ptype" :class="previewType === ptype? 'is-selected is-info': ''" @click="previewType = ptype">{{ptype}}</span>
      </div>
      <span class="buttons has-addons edit-button" v-if="isEdit" >
        <span class="button icon-edit is-info" @click="editFrame"></span>
        <span class="button icon-trash is-danger" @click=""></span>
      </span>
      <div v-if="currentAnimation && previewType==='方块'" class="preview-box" :class="currentAnimation.name"></div>
      <div v-if="currentAnimation && previewType==='文字'" class="preview-text" :class="currentAnimation.name">danke.fun</div>
      <div v-if="previewType==='图片'" class="preview-box" :class="currentAnimation.name">
        <img src="http://cdn.danke.fun/res/sample1.png" width="160" height="160">
      </div>

    </div>
  </div>
  <div class="column is-one-third-tablet column-list">
    <nav class="panel">
      <div class="panel-block">
          <p class="control">
            <router-link to="/builder-frame" class="button icon-plus is-small is-info">创建</router-link>
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
          {{type.value}}
        </a>
      </p>
      <a v-for="animation in animations" :key="animation.name" class="panel-block" @click="setAnimation(animation)" :class="currentAnimation.name === animation.name? 'is-active': ''">
         {{animation.desc || animation.name}}
      </a>
    </nav>
  </div>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao'
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
      previewType: '方块',
      previewTypes: ['方块', '文字', '图片'],
      currentType: '',
      searchFilter: '',
      currentAnimation: null,
      animations: [],
      animationTypes:[{
          key: '',
          value: '全部'
        },
        {
          key: '1',
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
    this.restdao = new RestDAO(this.ctx, 'danke/animation')
    this.loadAnimation()
  },
  methods: {
    setAnimation (animation) {
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

    removeFrame () {

      this.restdao.delete(this.currentAnimation)
    },

    editFrame () {
      this.ctx.editAnimation = this.currentAnimation
      this.$router.push('/builder-frame')
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
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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
