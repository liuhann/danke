const REG_LEN = /([+-]?[0-9#]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/

/**
 * 抽取长度信息  例如 10vw -> {len:10, unit: 'vw'}
 * @param len
 * @returns {{len: (*|string), unit: (*|string)}}
 */
function getLenSplits (len) {
  const splits = REG_LEN.exec(len)
  return {
    len: parseFloat(splits[1]) || 0,
    unit: splits[2]
  }
}

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

function revertLength (value, currentLen, device) {
  const { unit } = getLenSplits(currentLen)
  if (unit === 'vw') {
    return Math.floor(100 * value / device.width) + 'vw'
  } else if (unit === 'vh') {
    return Math.floor(100 * value / device.height) + 'vh'
  } else if (unit === 'px') {
    return value + 'px'
  }
}

function getElementStyle (element, device, animation) {
  const styles = []
  // position and size
  styles.push(getPositionSizingStyle(element, device))

  if (element.background) {
    styles.push(getBackgroundStyle(element.background, element.url))
  }

  if (element.clip) {
    const points = []
    for (let point of element.clip.points) {
      points.push(`${point[0]}% ${point[1]}%`)
    }
    if (element.clip.type === 'polygon') {
      styles.push(`clip-path: polygon(${points.join(',')})`)
    } else if (element.clip.type === 'circle') {
      styles.push(`clip-path: circle(${element.clip.points[0]}% at ${element.clip.points[1]}% ${element.clip.points[2]}%)`)
    } else if (element.clip.type === 'ellipse') {
      if (points.length === 2) {
        styles.push(`clip-path: ellipse(${points[0]} at ${points[1]})`)
      }
    }
  }
  // border
  if (element.border) {
    if (parseInt(element.border.width) === 0) {
    } else {
      if (element.border.sides.length === 4) {
        styles.push(`border: ${element.border.width}px ${element.border.style} ${element.border.color}`)
      } else {
        for (let side of element.border.sides) {
          styles.push(`border-${side}: ${element.border.width}px ${element.border.style} ${element.border.color}`)
        }
      }
    }
    styles.push(`border-radius: ${element.border.radius}px`)
  }
  // font
  if (element.font) {
    styles.push(`font-size: ${element.font.size}px`)
    styles.push(`color: ${element.font.color}`)
    styles.push(`text-align: ${element.font.align}`)
    styles.push(`font-weight: ${element.font.weight}`)
    styles.push(`letter-spacing: ${element.font.spacing}px`)
    styles.push(`text-decoration: ${element.font.decoration}px`)
    styles.push(`padding: ${getLength(element.font.padding, device)}px`)
  }

  if (element.transform) {
    styles.push(getTransformStyle(element.transform))
    if (element.transform.opacity != null) {
      styles.push(`opacity: ${element.transform.opacity / 100}`)
    }
  }
  if (animation && element[animation]) {
    const animationDef = element[animation]
    styles.push(`animation: ${animationDef.name} ${animationDef.duration}ms ${animationDef.timing} ${animationDef.delay}ms ${animationDef.iteration} normal both running`)
  }
  return styles.join(';')
}

function getPositionSizingStyle (element, device) {
  const styles = []
  if (element.position && device) {
    styles.push(`position: absolute`)
    if (element.position.vertical === 'top') {
      styles.push(`top: ${getLength(element.position.offsetY, device)}px`)
    } else if (element.position.vertical === 'center') {
      styles.push(`top: ${device.height / 2 - getLength(element.size.height, device) / 2 + getLength(element.position.offsetY, device)}px`)
    } else if (element.position.vertical === 'bottom') {
      styles.push(`bottom: ${getLength(element.position.offsetY, device)}px`)
    }

    if (element.position.horizontal === 'left') {
      styles.push(`left: ${getLength(element.position.offsetX, device)}px`)
    } else if (element.position.horizontal === 'center') {
      styles.push(`left: ${(device.width / 2) - (getLength(element.size.width, device) / 2) + getLength(element.position.offsetX, device)}px`)
    } else if (element.position.horizontal === 'right') {
      styles.push(`right: ${getLength(element.position.offsetX, device)}px`)
    }
  }

  if (element.size && device) {
    styles.push(`width: ${getLength(element.size.width, device)}px`)
    styles.push(`height: ${getLength(element.size.height, device)}px`)
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

function getBackgroundStyle (background, url) {
  const styles = []
  const backgroundImages = []
  let bgUrl = url || background.url
  if (bgUrl) {
    backgroundImages.push(`url('${bgUrl}')`)
  }
  if (background.colors.length > 1) {
    backgroundImages.push(`linear-gradient(${background.angle}, ${background.colors.join(',')})`)
  } else if (background.colors.length === 1) {
    styles.push(`background-color: ${background.colors[0]}`)
  }
  if (backgroundImages.length) {
    styles.push(`background-image: ${backgroundImages.join(' ')}`)
  }
  if (bgUrl) {
    styles.push(`background-size: ${background.size}`)
    styles.push(`background-position: ${background.position}`)
    if (background.repeat) {
      styles.push(`background-repeat: repeat`)
    } else {
      styles.push(`background-repeat: no-repeat`)
    }
    styles.push(`background-blend-mode: ${background.blend}`)
  }
  return styles.join(';')
}

function getTransformStyle (transform) {
  const styles = []
  if (transform.psp) {
    styles.push(`perspective(${transform.psp}px)`)
  }
  if (transform) {
    if (transform.translate) {
      styles.push(`translate3d(${transform.translate[0]}%, ${transform.translate[1]}%, ${transform.translate[2]}px)`)
    }
    if (transform.rotate) {
      styles.push(`rotateX(${transform.rotate[0]}deg)`)
      styles.push(`rotateY(${transform.rotate[1]}deg)`)
      styles.push(`rotateZ(${transform.rotate[2]}deg)`)
    }
  }
  if (transform.scale) {
    styles.push(`scale(${transform.scale / 100})`)
  }
  return `transform: ${styles.join(' ')}`
}
function getWorkStyle (work, device) {
  return getBackgroundStyle(work.background)
}

function getSceneStyle (scene, device) {
  const styles = []
  styles.push(getBackgroundStyle(scene.background))
  styles.push(`width: ${device.width}px`)
  styles.push(`height: ${device.height}px`)
  if (scene.type === 'background') {
    styles.push(`z-index: 10`)
  } else if (scene.type === 'foreground') {
    styles.push(`z-index: 500`)
  } else {
    styles.push(`z-index: 100`)
  }
  return styles.join(';')
}

export {
  getLength,
  getLenSplits,
  getGradientStyle,
  getBackgroundStyle,
  getElementStyle,
  getWorkStyle,
  getSceneStyle,
  getPositionSizingStyle,
  revertLength
}
