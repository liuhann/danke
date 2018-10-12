import VueAnimeTyping from 'vue-anime-typing/src/AnimeTyping'

export default {
  components: {
    VueAnimeTyping
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
