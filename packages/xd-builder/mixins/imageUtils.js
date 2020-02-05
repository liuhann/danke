export function getImageUrl (url, w, h) {
  if (url.endsWith('.svg')) {
    return this.ctx.IMG_SERVER + '/' + url
  } else {
    return this.ctx.IMG_SERVER + '/' + url + `?x-oss-process=image/format,webp/quality,Q_80/resize,m_mfit,h_${h || 100},w_${w || 100}`
  }
}
