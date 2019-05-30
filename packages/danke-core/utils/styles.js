import { TypeEnum } from '../elements/index'
import { getLenSplits, getLength } from './common'

import { getBoxShadowStyle } from '../css-model/boxshadow'
import { getFontStyle } from '../css-model/font'
import { getBackgroundStyle } from '../css-model/background'
import { getBorderStyle } from '../css-model/border'
import { getClipPathStyle } from '../css-model/clippath'
import { getTransformStyle } from '../css-model/transform'

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
  let styles = []
  // position and size
  styles = styles.concat(getPositionSizingStyle(element, device))
    .concat(getBoxShadowStyle(element, device))
    .concat(getFontStyle(element, device))
    .concat(getBorderStyle(element, device))
    .concat(getBoxShadowStyle(element, device))
    .concat(getBackgroundStyle(element, device))
    .concat(getClipPathStyle(element, device))
    .concat(getTransformStyle(element, device))
    .concat(getBoxShadowStyle(element, device))

  if (animation && element[animation]) {
    const animationDef = element[animation]
    styles.push(`animation: ${animationDef.name} ${animationDef.duration}ms ${animationDef.timing} ${animationDef.delay}ms ${animationDef.iteration} normal both running`)
  }
  return styles.filter(n => n).join(';')
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
    styles.push(`z-index: ${element.position.z}`)
  }

  if (element.size && device) {
    styles.push(`width: ${getLength(element.size.width, device)}px`)
    if (element.type !== TypeEnum.TEXT) {
      styles.push(`height: ${getLength(element.size.height, device)}px`)
    }
  }
  return styles
}

function getWorkStyle (work, device) {
  return getBackgroundStyle(work.background)
}

function getSceneStyle (scene, device) {
  const styles = []
  styles.push(getBackgroundStyle({
    background: scene.background
  }))
  styles.push(`width: ${device.width}px`)
  styles.push(`height: ${device.height}px`)
  if (scene.type === 'background') {
    styles.push(`z-index: 1`)
  } else if (scene.type === 'foreground') {
    styles.push(`z-index: 10`)
  } else {
    styles.push(`z-index: 5`)
  }
  return styles.join(';')
}

export {
  getLength,
  getLenSplits,
  getElementStyle,
  getWorkStyle,
  getSceneStyle,
  getPositionSizingStyle,
  revertLength
}
