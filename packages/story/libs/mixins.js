import { Howl, Howler } from 'howler'

export default {
  data () {
    return {
      currentPlayStory: null,
      isPlaying: false,
      seconds: 0
    }
  },
  filters: {
    timeFormat: function (t) {
      try {
        const i = parseInt(t)
        return Math.floor(i / 60) + '分' + i % 60 + '秒'
      } catch (e) {
        return '未知'
      }
    }
  },

  computed: {
  },
  methods: {
    playStory (story) {
      this.ctx.playStory(story)
    },
    play (story) {
      this.currentPlayStory = story
      this.playingOpen = true
      this.ctx.howl = new Howl({
        src: ['sound.mp3']
      })
      this.howl.play()
    },
  }
}