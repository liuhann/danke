<template>
<div class="columns frame-box-columns">
  <div class="column is-two-thirds-tablet">
    <div class="frame-preview">
      <div v-if="currentAnimation" class="preview-box" :class="currentAnimation.name"></div>
    </div>
  </div>
  <div class="column is-one-third-tablet column-list">
    <nav class="panel">
      <div class="panel-block">
        <p class="control has-icons-right">
          <input class="input is-small" type="text" placeholder="按名称查找" v-model="searchFilter">
          <span class="icon is-small is-right">
            <i class="icon-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
    <p class="panel-tabs">
      <a v-for="(type, index) in animationTypes" :key="index" @click="changeType(type)" :class="currentType === type.key? 'is-active': ''">
        {{type.value}}
      </a>
    </p>
    <a v-for="animation in animations" :key="animation.name" class="panel-block" @click="setAnimation(animation)" :class="currentAnimation.name === animation.name? 'is-active': ''">
       {{animation.desc}}
    </a>
      <div class="panel-block" v-if="select">
        <button class="button is-link is-outlined is-fullwidth">
          选择
        </button>
      </div>
    </nav>
  </div>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao'

export default {
  name: 'FrameBox',
  props: {
    select: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
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
      if (this.type) {
        query.type = this.type
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
    changeType (type) {
      this.currentType = type.key
      this.loadAnimation()
    }
  }
}
</script>

<style lang="scss">
.frame-preview {
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
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
    width: 100vw;
    height: 80vw;
  }
}


</style>
