<template>
<div class="player">
  <div class="cover-container">
    <figure class="image is-240x240">
        <img class="is-rounded" :src="CDN_IMG + '/' + story.cover + '.png@w_240,h_240,s_2,q_100'" :alt="story.title">
    </figure>
    <i class="icon-left-open" @click="returnHome"></i>
  </div>
  <div class="body">
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{story.title}}</strong>
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item" v-if="story.artist">
            {{story.artist}}
          </a>
          <a class="level-item">
            时长: {{story.duration | timeFormat}}
          </a>
        </div>
      </nav>
    </div>

    <nav class="level buttons is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <i class=""></i>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title-1 icon-heart-empty"></p>
          <p class="sub-title">122</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title-1 icon-heart-empty"></p>
          <p class="sub-title">122</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="icon-heart-empty"></p>
          <p class="title">122</p>
        </div>
      </div>
    </nav>
    <div class="teller">
    </div>
  </div>
</div>
</template>

<script>
import { setInterval } from 'timers'
import mixins from './mixins.js'
export default {
  name: 'Playing.vue',
  mixins: [ mixins ],
  props: {
    story: {
      type: Object
    }
  },
  components: {  },
  data () {
    return {
      CDN_IMG: this.ctx.CDN_IMG
    }
  },
  created () {
    this.tick = setInterval( () => {
      
    })
  },
  methods: {
    returnHome () {
      this.$emit('return')
    }
  }
}
</script>
<style lang="scss">
.cover-container {
  width: 100vw;
  height: 100vw;
  position: relative;
  .icon-left-open {
    position: absolute;
    left: 1rem;
    top: 1rem;
    font-size: 1.5rem;
    color: #eee;
  }
  .image {
    img {
      box-shadow:0px 0px 0px 14px rgba(0,0,0,.3);
    }
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -120px;
    margin-top: -120px;
  }
}
.player {
  margin: -3.5rem 0;
}
</style>
