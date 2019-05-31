<template>
<div class="columns">
  <div class="column is-two-thirds-tablet">
    <div class="frame-preview">
      <div v-if="currentAnimation" class="preview-box" :class="currentAnimation.name"></div>
    </div>
  </div>
  <div class="column is-one-third-tablet">
    <nav class="panel">
      <div class="panel-block">
        <p class="control">
          <input class="input is-small" type="text" placeholder="按名称查找" v-model="searchFilter">
          <span class="icon is-small is-left">
            <i class="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
    <p class="panel-tabs">
      <a v-for="(type, index) in animationTypes" @click="changeType(type)" :class="currentType === type.key? 'is-active': ''">
        {{type.value}}
      </a>
    </p>
    <a v-for="animation in animations" class="panel-block" @click="setAnimation(animation)" :class="currentAnimation.name === animation.name? 'is-active': ''">
      <span class="panel-icon">
        <i class="fas fa-book" aria-hidden="true"></i>
      </span>
      {{animation.name}} ({{animation.desc}})
    </a>
      <label class="panel-block">
        <input type="checkbox">
        remember me
      </label>
      <div class="panel-block">
        <button class="button is-link is-outlined is-fullwidth">
          reset all filters
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
@media screen and (max-width: 640px) {
  .frame-preview {
    width: 100vw;
    height: 80vw;
  }
}


</style>
