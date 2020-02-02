export default {
  methods: {
    getImageUrl (url, w, h) {
      if (url.endsWith('.svg')) {
        return this.ctx.IMG_SERVER + '/' + url
      } else {
        return this.ctx.IMG_SERVER + '/' + url + `?x-oss-process=image/format,jpg/quality,Q_100/resize,m_fill,h_${w || 100},w_${h || 100}`
      }
    }
  }
}
