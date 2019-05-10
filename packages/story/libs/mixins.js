export default {
  data () {
    return {
      CDN_STORY: 'http://chuchu.cdn.bcebos.com',
      CDN_IMG: 'http://imagek.cdn.bcebos.com'
    }
  },
  created () {

  },
  filters: {
    timeFormat: function (t) {
      try {
        const i = parseInt(t)
        if (isNaN(i)) {
          return '0:00'
        } else {
          return Math.floor(i / 60) + ':' + ((i % 60 < 10) ? `0${i % 60}` : (i % 60))
        }
      } catch (e) {
        return '未知'
      }
    }
  },
  methods: {}
}