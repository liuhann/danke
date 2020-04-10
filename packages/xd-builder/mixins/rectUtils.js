/**
   * Fits a rectangle into anothers rectangles bounds
   * @param rect
   * @param bounds
   * @returns {width: Number, height: Number}
   */
export function fitRectIntoBounds (rect, bounds) {
  // if rect is small
  if (rect.width < bounds.width && rect.height < bounds.height) {
    return rect
  }

  var rectRatio = rect.width / rect.height
  var boundsRatio = bounds.width / bounds.height

  var newDimensions = {}

  // Rect is more landscape than bounds - fit to width
  if (rectRatio > boundsRatio) {
    newDimensions.fitTo = 'width'
    newDimensions.width = bounds.width
    newDimensions.height = Math.floor(rect.height * (bounds.width / rect.width))
  } else {
    // Rect is more portrait than bounds - fit to height
    newDimensions.fitTo = 'height'
    newDimensions.width = Math.floor(rect.width * (bounds.height / rect.height))
    newDimensions.height = bounds.height
  }

  return newDimensions
}

/**
 * 获取Rect类型元素的位置样式
 * @param {x, y, width, height} rect 元素位置
 * @param {width, height} origin 默认屏幕大小
 * @param {width, height} viewPort 给出的可视区域大小
 * @param {string} fitMode 对齐模式
 */
export function getRectPositionStyle (rect, origin, viewPort, fitMode = '') {
  let result = null
  if (origin && viewPort) {
    result = {
      position: 'absolute',
      left: rect.x * viewPort.width / origin.width + 'px',
      top: rect.y  * viewPort.height / origin.height + 'px',
      width: rect.width * viewPort.width / origin.width + 'px',
      height: rect.height * viewPort.height / origin.height + 'px'
    }
  } else {
    result = {
      position: 'absolute',
      left: rect.x + 'px',
      top: rect.y + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px'
    }
  }
  return result
}

/**
 * 指定的点是否在矩形范围内
 * @param {*} point
 * @param {*} rect
 */
export function isPointInRect (point, rect, outer = 0) {
  return (point.x - rect.x) < (rect.width + outer) && (point.x - rect.x) > -outer && (point.y - rect.y) < (rect.height + outer) && (point.y - rect.y) > -outer
}

/**
 * 判断2个矩形是否有交集
 * @param {*} r1
 * @param {*} r2
 */
export function intersectRect (r1, r2) {
  return !(r2.x > (r1.x + r1.width) ||
           (r2.x + r2.width) < r1.x ||
           r2.y > (r1.y + r1.height) ||
           (r2.y + r2.height) < r1.y)
}
