const REG_LEN = /([+-]?[0-9#]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/

/**
 * 抽取长度信息  例如 10vw -> {len:10, unit: 'vw'}
 * @param len
 * @returns {{len: (*|string), unit: (*|string)}}
 */
function getLenSplits (len) {
  const splits = REG_LEN.exec(len)
  return {
    len: parseFloat(splits[1]),
    unit: splits[2]
  }
}

function getLength (unitLen, device, px) {
  // -15vw ->  [-15vw,-15,vw]
  if (unitLen === 0 || unitLen == null || unitLen === '') {
    return '0'
  }
  const { len, unit } = getLenSplits(unitLen)
  let number = 0
  if (unit === 'vw') {
    number = Math.floor(device.width * len / 100)
  } else if (unit === 'vh') {
    number = Math.floor(device.height * len / 100)
  } else if (unit === 'px') {
    number = len
  }
  return number + (px || '')
}

/**
 * 将以px定位形式转换为按element原定位方式的单位
 * @param element 元素配置
 * @param newPos 新的位置信息
 * @param coordinate 坐标
 * @param device 设备
 */
function toViewPoint (element, newPos, coordinate, device) {
  const result = {}
  if (newPos.left) {
    if (coordinate === 'center') {
      result.x = setLenFromPx(newPos.left - device.width / 2, element.x, device)
    } else {
      result.x = setLenFromPx(newPos.left, element.x, device)
    }
  } else {
    result.x = element.x
  }

  if (newPos.top) {
    if (coordinate === 'center') {
      result.y = setLenFromPx(newPos.top - device.height / 2, element.y, device)
    } else {
      result.y = setLenFromPx(newPos.top, element.y, device)
    }
  } else {
    result.y = element.y
  }

  if (newPos.width) {
    result.w = setLenFromPx(newPos.width, element.width, device)
  } else {
    result.w = element.width
  }

  if (newPos.height) {
    result.h = setLenFromPx(newPos.height, element.height, device)
  } else {
    result.h = element.height
  }
  return result
}

// 将以px为单位的长度转换回vw、 vh等长度格式
function setLenFromPx (newValue, originalValue, device) {
  let { unit } = getLenSplits(originalValue)
  if (unit === 'vw') {
    return Math.floor(newValue / device.width * 100) + 'vw'
  } else if (unit === 'vh') {
    return Math.floor(newValue / device.height * 100) + 'vh'
  } else {
    return newValue
  }
}

/**
 * 将element的 x y w h 转换到针对device及坐标的像素形式
 * @param element
 * @param coordinate
 * @param device
 */
function toPixel (element, coordinate, device) {
  const result = {}
  if (coordinate === 'center') { // center
    result.x = device.width / 2 + parseInt(getLength(element.x, device))
  } else { // tl
    result.x = parseInt(getLength(element.x, device))
  }
  if (coordinate === 'center') {
    result.y = device.height / 2 + parseInt(getLength(element.y, device))
  } else {
    result.y = parseInt(getLength(element.y, device))
  }
  result.w = parseInt(getLength(element.width, device))
  result.h = parseInt(getLength(element.height, device))
  return result
}

export default {
  toViewPoint,
  toPixel,
  setLenFromPx,
  getLenSplits,
  getLength
}
