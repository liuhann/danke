/**
 *
 * @param url
 * @param w
 * @param h
 * @param method 取值范围：
     lfit（默认值）：等比缩放，缩放图限制为指定w与h的矩形内的最大图片。
     mfit：等比缩放，缩放图为延伸出指定w与h的矩形框外的最小图片。
     fill：将原图等比缩放为延伸出指定w与h的矩形框外的最小图片，之后将超出的部分进行居中裁剪。
     pad：将原图缩放为指定w与h的矩形内的最大图片，之后使用指定颜色居中填充空白部分。
     fixed：固定宽高，强制缩放。
   * @returns {string|null}
 */
export function getImageUrl (url, w, h, method = 'mfit') {
  if (!url) {
    return null
  }
  if (url.endsWith('.svg') || !w || !h ) {
    return this.ctx.IMG_SERVER + '/' + url
  } else {
    return this.ctx.IMG_SERVER + '/' + url + `?x-oss-process=image/format,png/quality,Q_80/resize,m_${method},h_${Math.floor(h) || 100},w_${Math.floor(w) || 100}`
  }
}
