<template>
<div id="page-frame-list">
  <nav-bar></nav-bar>
  <div class="section">
    <div class="container">
      <frame-box :is-edit="true"></frame-box>
    </div>
  </div>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import NavBar from '../site/components/NavBar'
import { createSheet, addAnimationStyle } from './keyframe'
import FrameBox from './FrameBox'
import NavFooter from '../site/components/NavFooter'
export default {
  name: 'PageFrameList',
  components: {
    NavFooter,
    FrameBox,
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
    animationTypes () {
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

    debounce (func, wait, immediate) {
      var timeout
      return function () {
        var context = this, args = arguments
        var later = function () {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    },

    goFrameTool () {
      this.$router.push('/frames')
    },

    edit (animation) {
      this.ctx.editAnimation = animation
      this.$router.push('/frames')
    },

    replay (animation) {
      this.debounce(() => {
        if (!animation.nameCache) {
          animation.nameCache = animation.name
        }
        animation.name = 'none'
        setTimeout(() => {
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
#page-frame-list {
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
