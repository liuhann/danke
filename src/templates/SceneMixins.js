import VueAnimeTyping from 'vue-anime-typing/src/AnimeTyping'
import VueMovingImage from 'vue-moving-image/src/components/MovingImage'
import VueTextBubble from './TextBubble'
export default {
  components: {
    VueAnimeTyping,
    VueMovingImage,
    VueTextBubble
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
    this.danke.nanobus.once('scene-enter-' + this.index, this.onEnter)
    this.danke.nanobus.once('scene-leave-' + this.index, this.onLeave)
  },
  methods: {
    screenClick () {
      this.ticker.emit({
        index: this.index,
        name: 'click'
      })
    },
    onEnter (data) {
      console.log('scene enter')
    },
    onLeave (data) {
      console.log('scene leave')
    }
  }
}
