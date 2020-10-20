export function getImageUrl (url, w, h) {
  if (!url) {
    return null
  }
  if (url.endsWith('.svg') || !w || !h ) {
    return this.ctx.IMG_SERVER + '/' + url
  } else {
    return this.ctx.IMG_SERVER + '/' + url + `?x-oss-process=image/format,png/quality,Q_80/resize,m_mfit,h_${Math.floor(h) || 100},w_${Math.floor(w) || 100}`
  }
}
