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
  methods: {
    screenClick () {
      this.engine.emit({
        index: this.index,
        name: 'click'
      })
    }
  }
}
