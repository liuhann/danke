<template>
  <div id="app">
    <nav-bar></nav-bar>
    <div class="section columns is-multiline">
        <div class="column is-one-fifth" v-for="animation in animations">
          <div class="card">
            <div class="card-image play-area" @click="replay(animation)">
              <div class="preview-box" :class="animation.name"></div>
            </div>
            <div class="card-content box">
              <div class="level">
                <div class="right-item">
                  <a class="icon-play" @click="replay(animation)"></a>
                  <a class="icon-plus"></a>
                  <a class="icon-trash-empty" v-if="!animation.userid || animation.userid === userid" @click="removeAnimation(animation._id)"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../common/NavBar'
import { createSheet, addAnimationStyle, clearAnimation } from './keyframe'
import userContextMixin from '../common/user-context-mixin'
export default {
  name: 'app',
  components: {
    NavBar
  },
  mixins: [userContextMixin],
  data () {
    return {
      skip: 0,
      total: 10000,
      animations: []
    }
  },
  computed: {

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
    async getFrames () {
      const response = await this.ctx.animdao.getAnimationList(this.skip, 30)
      this.total = response.total
      this.animations = this.animations.concat(response.list)

      for (let animation of this.animations) {
        addAnimationStyle(this.sheet, animation)
      }
    },

    async removeAnimation (_id) {
      await this.ctx.animdao.removeAnimation(_id)
      this.getFrames()
    },

    replay (animation) {
      const name = animation.name
      animation.name = 'none'
      setTimeout( () => {
        animation.name = name
      }, 300)
    },
    play () {

    }
  }
}
</script>

<style lang="scss">
.play-area {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  .run-button1 {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -20px;
    margin-top: -20px;
    border-radius: 40px;
    font-size: 28px;
    width: 40px;
    height: 40px
  }
}
.play-area:before {
  content: "";
  display: block;
  padding-top: 100%;  /* ratio of 1:1*/
}
</style>
