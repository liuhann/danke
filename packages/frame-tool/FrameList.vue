<template>
  <div>
    <nav-bar></nav-bar>
    <div class="section">
      <span class="button icon-mobile" @click="goFrameTool">创建动画</span>
      <div class="columns is-multiline is-mobile is-tablet">
          <div class="column is-one-fifth-widescreen is-three-quarters-tablet is-half-mobile" v-for="animation in animations">
            <div class="">
              <div class="card-image play-area" @click="replay(animation)">
                <div class="preview-box" :class="animation.name"></div>
              </div>
              <div class="card-content">
                <div>{{animation.desc}}</div>
                <a class="icon-play" @click="replay(animation)"></a>
                <a class="icon-edit" v-if="!animation.userid || animation.userid === userid" @click="edit(animation)"></a>
                <a class="icon-plus" v-if="!animation.userid || animation.userid === userid" @click="addToMine"></a>
                <a class="icon-trash-empty" v-if="!animation.userid || animation.userid === userid" @click="removeAnimation(animation._id)"></a>
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

    goFrameTool () {
      this.$router.push('/frame-tool')
    },

    async removeAnimation (_id) {
      await this.ctx.animdao.removeAnimation(_id)
      this.getFrames()
    },

    edit (animation) {
      this.ctx.editAnimation = animation
      this.$router.push('/frame-tool')
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
</style>
