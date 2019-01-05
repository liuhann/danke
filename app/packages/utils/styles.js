import positionUtil from './position'

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
  return number + (px || '')
}

function getElementStyle (element, device) {
  const styles = []
  if (element.position) {
    if (element.position.vertical === 'top') {
      styles.push(`top: ${positionUtil.getLength(element.position.offsetY, device, 'px')}`)
    } else if (element.position.vertical === 'center') {
      styles.push(`top: ${device.height / 2 - positionUtil.getLength(element.position.height, device) / 2 + positionUtil.getLength(element.position.offsetY, device)}px`)
    } else if (element.position.vertical === 'bottom') {
      styles.push(`bottom: ${positionUtil.getLength(element.position.offsetY, device)}px`)
    }

    if (element.position.horizontal === 'left') {
      styles.push(`left: ${positionUtil.getLength(element.position.offsetX, device, 'px')}`)
    } else if (element.position.horizontal === 'center') {
      console.log((positionUtil.getLength(element.position.width, device) / 2))
      styles.push(`left: ${(device.width / 2) - (getLength(element.position.width, device) / 2) + getLength(element.position.offsetX, device)}px`)
    } else if (element.position.horizontal === 'right') {
      styles.push(`right: ${positionUtil.getLength(element.position.offsetX, device)}px`)
    }
    styles.push(`width: ${positionUtil.getLength(element.position.width, device, 'px')}`)
    styles.push(`height: ${positionUtil.getLength(element.position.height, device, 'px')}`)
  }

  if (element.background.mode === '1') {
    styles.push(`background-color: ${element.background.color}`)
  } else if (element.background.mode === '2') {
    styles.push(getGradientStyle(element.background.gradients, element.background.angle, element.src))
  } else if (element.background.mode === '0') {
    styles.push(`background: transparent`)
  }
  if (element.clip) {
    styles.push(`clip-path: polygon(${element.clip.ax}% ${element.clip.ay}%, ${element.clip.bx}% ${element.clip.by}%, ${element.clip.cx}% ${element.clip.cy}%, ${element.clip.dx}% ${element.clip.dy}%)`)
  }
  if (element.border) {
    if (parseInt(element.border.width) === 0) {
      styles.push(`border: none`)
    } else {
      if (element.border.sides.length === 4) {
        styles.push(`border: ${element.border.width}px ${element.border.style} ${element.border.color}`)
      } else {
        for (let side of element.border.sides) {
          styles.push(`border-${side}: ${element.border.width}px ${element.border.style} ${element.border.color}`)
        }
      }
    }
    styles.push(`border-radius: ${element.border.radius[0]}px ${element.border.radius[1]}px ${element.border.radius[2]}px ${element.border.radius[3]}px;`)
  }
  return styles.join(';')
}

function getGradientStyle (colors, angle, blendImage) {
  let style = `background-image: linear-gradient(${angle}, ${colors.join(',')})`
  if (blendImage) {
    style = style + `, url('${blendImage}')`
  }
  return style
}

export default {
  getGradientStyle,
  getElementStyle
}
