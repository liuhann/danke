<template>
  <div class="page-frame-list">
    <nav-bar></nav-bar>
    <div class="section">
      <div class="container">
      <nav class="level">
        <div class="level-left">
          <span class="button icon-mobile is-small" @click="goFrameTool">创建动画</span>
        </div>
        <div class="level-right buttons has-addons">
          <span v-for="type in animationTypes" :key="type.key" class="button is-small" :class="animationType===type.key? 'is-selected is-info':''"
                @click="setAnimationType(type.key)">{{type.value}}</span>
        </div>
      </nav>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="columns is-multiline is-mobile is-tablet">
          <div class="column is-one-fifth-widescreen is-three-quarters-tablet is-half-mobile" v-for="animation in animations" :key="animation.name">
            <div class="card-image play-area" @click="replay(animation)" @mouseenter.once="replay(animation)">
              <div class="preview-box" :class="animation.name"></div>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <p class="title is-6">{{animation.desc}}</p>
                  <p class="subtitle is-7">{{animation.name}}</p>
                </div>
                <div class="media-right">
                  <a class="icon-edit" v-if="!animation.userid || animation.userid === userid" @click="edit(animation)"></a>
                  <a class="icon-heart-empty" @click="addToMine"></a>
                  <a class="icon-trash-empty" v-if="!animation.userid || animation.userid === userid" @click="removeAnimation(animation._id)"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../common/site/NavBar'
import { createSheet, addAnimationStyle, clearAnimation } from './keyframe'
export default {
  name: 'PageFrameList',
  components: {
    NavBar
  },
  mixins: [ ],
  data () {
    return {
      animationType: '',
      skip: 0,
      total: 10000,
      userid: this.ctx.user.id,
      animations: []
    }
  },
  computed: {
    animationTypes() {
      return [{
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
  watch: {

  },
  created () {
    this.getFrames()
    this.sheet = createSheet()
  },

  mounted () {

  },

  methods: {
    setAnimationType (type) {
      this.animationType = type
      this.skip = 0
      this.animations = []
      this.getFrames()
    },
    async getFrames () {
      const response = await this.ctx.animdao.getAnimationList(this.animationType, this.skip, 30)
      this.total = response.total
      this.animations = this.animations.concat(response.list)

      for (let animation of this.animations) {
        addAnimationStyle(this.sheet, animation)
      }
    },

    debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    goFrameTool () {
      this.$router.push('/frame-tool')
    },

    async removeAnimation (_id) {
      await this.ctx.animdao.removeAnimation(_id)
      this.animations = []
      this.getFrames()
    },

    edit (animation) {
      this.ctx.editAnimation = animation
      this.$router.push('/frame-tool')
    },

    replay (animation) {
      this.debounce(() => {
        if (!animation.nameCache) {
          animation.nameCache = animation.name
        }
        animation.name = 'none'
        setTimeout( ()=> {
          animation.name = animation.nameCache
        }, 300)
      }, 1000)()

      //
      // setTimeout( () => {
      //   animation.name = animation.nameCache
      // }, 20)
    },

    addToMine () {

    },

    play () {

    }
  }
}
</script>

<style lang="scss">
.page-frame-list {
  .play-area {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: rgba(0, 0, 0, .2);
    .preview-box {
      background-color: #FF4B4B;
      width: 80px;
      height: 80px;
      overflow: hidden;
      box-sizing: border-box;
      .modal-background {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &:hover {
      background-color: rgba(0, 0, 0, .5);
    }
  }
  .card-content {
    padding: .5em;
    background-color: rgba(0, 0, 0, .4);
  }
  .play-area:before {
    content: "";
    display: block;
    padding-top: 100%;  /* ratio of 1:1*/
  }
}
</style>
