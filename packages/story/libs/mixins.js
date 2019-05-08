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
        return Math.floor(i / 60) + '分' + i % 60 + '秒'
      } catch (e) {
        return '未知'
      }
    }
  },
  methods: {}
}