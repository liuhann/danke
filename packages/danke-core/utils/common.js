import { trim as animationTrim } from '../css-model/animation'

const REG_LEN = /([+-]?[.0-9#]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/
/**
 * 抽取长度信息  例如 10vw -> {len:10, unit: 'vw'}
 * @param len
 * @returns {{len: (*|string), unit: (*|string)}}
 */
function getLenSplits (len) {
  const splits = REG_LEN.exec(len)
  if (splits == null) {
    return {
      len: 0,
      unit: len
    }
  } else {
    return {
      len: parseFloat(splits[1]) || 0,
      unit: splits[2]
    }
  }
}

/**
 * get object with unit and len from length string
 * @param {String} unitLen: length string
 * @param {Object} device container device
 * @returns {number}
 */
function getLength (unitLen, device) {
  // -15vw ->  [-15vw,-15,vw]
  if (unitLen === 0 || unitLen == null || unitLen === '') {
    return 0
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
  return number
}

/**
 * get device size by ratio within the container
 * @param ratio
 * @param width
 * @param height
 * @returns {{width: number, height: number}}
 */
function fitToContainer (ratio, width, height) {
  // 获取比例
  let [w, h] = ratio.split(':')
  let rw = parseInt(w)
  let rh = parseInt(h)

  const heightByWidth = width / rw * rh
  if (heightByWidth > height) {
    const widthByHeight = height / rh * rw
    return {
      width: Math.floor(widthByHeight),
      height: Math.floor(height)
    }
  } else {
    return {
      width: Math.floor(width),
      height: Math.floor(heightByWidth)
    }
  }
}

function fitBy (ratio, width, height) {
  // 获取比例
  let [w, h] = ratio.split(':')
  let rw = parseInt(w)
  let rh = parseInt(h)
  if (width) {
    let ratioHeight = Math.floor(width / rw * rh)
    if (height && ratioHeight > height) {
      return {
        height,
        width: Math.floor(height / rh * rw)
      }
    } else {
      return {
        width,
        height: ratioHeight
      }
    }
  } else if (height) {
    return {
      height,
      width: Math.floor(height / rh * rw)
    }
  } else {
    return {
      width: 320,
      height: Math.floor(320 / rw * rh)
    }
  }
}

async function wait (mill) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, mill)
  })
}

/**
 * trim out same field by template
 * @param target
 * @param template
 */
function trimCompare (target, template) {
  const trimed = {}
  for (let key in target) {
    if (template[key] !== target[key]) {
      trimed[key] = target[key]
    }
  }
  return trimed
}

function resumeCompare (target, template) {
  const resumed = Object.assign({}, template)
  for (let key in target) {
    if (template[key] !== target[key]) {
      resumed[key] = target[key]
    }
  }
  return resumed
}

export { getLength, getLenSplits, fitToContainer, wait, resumeCompare, fitBy, trimCompare }
