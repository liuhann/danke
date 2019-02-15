<template>
<div class="text-bubble" :class="position">
  <vue-anime-typing v-if="typing" class="typing">{{typing.text}}</vue-anime-typing>
  <vue-anime v-else tag="span" class="content" :delay="100" :duration="1000" :style="{transform: 'scale(0) translateY(30px) translateX(-100px)'}" :animate="{scale:1,translateX:0, translateY: 0}">{{text || this.$slots.default[0].text}}</vue-anime>
  <vue-anime class="bubble-root" :delay="50" :duration="1000" :style="{transform: 'scale(0)'}" :animate="{scale:1}"></vue-anime>
  <vue-anime class="bubble-tail" :delay="0" :duration="1000" :style="{transform: 'scale(0)'}" :animate="{scale:1}"></vue-anime>
</div>
</template>

<script>
import VueAnimeTyping from 'vue-anime-typing/oldsrc/AnimeTyping'
import { VueAnime } from 'vue-anime'
export default {
  name: 'TextBubble',
  components: {
    VueAnimeTyping,
    VueAnime
  },
  props: {
    position: {
      type: String,
      default: 'bottom-left'
    },
    typing: {
      type: Object,
      default () {
        return null
      }
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less">
.text-bubble {
  overflow: initial;
  position: relative;
  .content {
    width: 100%;
    display: inline-block;
    background: #fff;
    padding: .5em;
    border-radius: .7em;
    line-height: 1.2;
  }
  &.bottom-left .bubble-root {
    top: calc(100% - .6em);
    width: 1em;
    height: 1em;
    left: 16%;
  }
  &.bottom-left .bubble-tail {
    top: calc(100% + .8em);
    width: 0.5em;
    height: 0.5em;
    left: 20%;
  }

  &.bottom-right .bubble-root {
    top: calc(100% - .6em);
    width: 1em;
    height: 1em;
    right: 16%;
  }
  &.bottom-right .bubble-tail {
    top: calc(100% + .8em);
    width: 0.5em;
    height: 0.5em;
    right: 20%;
  }
  .bubble-root, .bubble-tail {
    background: #fff;
    position: absolute;
    border-radius: 50%;
  }
}

</style>
