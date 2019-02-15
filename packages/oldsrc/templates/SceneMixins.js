import VueAnimeTyping from 'vue-anime-typing/oldsrc/AnimeTyping'
import VueMovingImage from 'vue-moving-image/oldsrc/components/MovingImage'
import VueTextBubble from './TextBubble'

import { VueAnime } from 'vue-anime'
export default {
  components: {
    VueAnimeTyping,
    VueMovingImage,
    VueTextBubble,
    VueAnime
  },
  props: {
    state: {
      type: String
    },
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  watch: {
    state (val) {

    }
  },

  mounted () {
    this.engine.nanobus.once('scene-enter-' + this.index, this.onEnter)
    this.engine.nanobus.once('scene-leave-' + this.index, this.onLeave)
  },
  methods: {
    screenClick () {
      this.ticker.emit({
        index: this.index,
        name: 'click'
      })
    },
    fontGroupStyle (element) {
      return {
        fontSize: (element.fontSize || 1) * this.gridWidth + 'px',
        color: element.color || '#fff'
      }
    },
    onEnter (data) {
      console.log('scene enter')
    },
    onLeave (data) {
      console.log('scene leave')
    }
  }
}
