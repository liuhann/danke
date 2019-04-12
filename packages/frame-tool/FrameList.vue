<template>
  <div id="app">
    <nav-bar></nav-bar>
    <div class="section columns is-multiline">
        <div class="column is-one-fifth" v-for="animation in animations">
          <div class="card">
            <div class="card-image play-area">
              <div v-if="animation.preview===1" class="preview-box" :class="animation.name"></div>
              <div v-if="animation.preview===2" class="preview-text" :class="animation.name">danke.fun</div>
              <div v-if="animation.preview===3" class="preview-box" :class="animation.name">
                <img src="http://cdn.danke.fun/res/sample1.jpg" width="160" height="160">
              </div>
            </div>
            <div class="card-content">
              {{animation.name}}
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../common/NavBar'
export default {
  name: 'app',
  components: {
    NavBar
  },
  computed: {

  },
  data () {
    return {
      skip: 0,
      total: 10000,
      animations: []
    }
  },
  watch: {
  },
  created () {
    this.getFrames()
  },

  mounted () {
  },

  methods: {
    async getFrames () {
      const response = await this.ctx.animdao.getAnimationList(this.skip, 30)
      this.total = response.total
      this.animations = this.animations.concat(response.list)
    },
    play () {

    }
  }
}
</script>

<style lang="scss" scoped>
.play-area {
  position: relative;

}
.play-area:before {
  content: "";
  display: block;
  padding-top: 100%;  /* ratio of 1:1*/
}
</style>
