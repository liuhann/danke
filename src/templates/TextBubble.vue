<template>
<div class="text-bubble" :class="position">
  <vue-anime-typing v-if="typing" class="typing">{{typing.text}}</vue-anime-typing>
  <span>{{text || this.$slots.default[0].text}}</span>
  <vue-anime class="bubble-root" :delay="600" :duration="600" :style="{transform: 'scale(0)'}" :animate="{scale:1}"></vue-anime>
  <vue-anime class="bubble-tail" :delay="500" :duration="600" :style="{transform: 'scale(0)'}" :animate="{scale:1}"></vue-anime>
</div>
</template>

<script>
import VueAnimeTyping from 'vue-anime-typing/src/AnimeTyping'
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
  display: inline-block;
  overflow: initial;
  position: relative;
  background: #fff;
  padding: .5em;
  border-radius: .7em;
  line-height: 1.2;
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
  .bubble-root, .bubble-tail {
    transform: scale(0);
    position: absolute;
    background: inherit;
    border-radius: 50%;
  }
}

</style>
