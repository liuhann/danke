import { getLenSplits, getLength, wait } from './common'

import { getBoxShadowStyle } from '../css-model/boxshadow'
import { getFontStyle } from '../css-model/font'
import { getBackgroundStyle } from '../css-model/background'
import { getBorderStyle } from '../css-model/border'
import { getClipPathStyle } from '../css-model/clippath'
import { getTransformStyle } from '../css-model/transform'
import { getShapeStyle } from '../css-model/shapeclip'
import { createSheet, addAnimationStyle } from '../../frames/keyframe'
import { getPositionStyle } from '../css-model/position'
import { getSizingStyle } from '../css-model/size'

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

let sheet = createSheet()

function getElementStyle (element, device, animation) {
  let styles = []
  // position and size
  styles = styles.concat(getPositionStyle(element, device))
    .concat(getSizingStyle(element, device))
    .concat(getBoxShadowStyle(element, device))
    .concat(getFontStyle(element, device))
    .concat(getBorderStyle(element, device))
    .concat(getBackgroundStyle(element, device))
    .concat(getClipPathStyle(element, device))
    .concat(getTransformStyle(element, device))
    .concat(getShapeStyle(element, device))

  if (animation && element.animation[animation] && element.animation[animation].name) {
    const animationDef = element.animation[animation]
    styles.push(`animation: ${animationDef.name} ${animationDef.duration}ms ${animationDef.timing} ${animationDef.delay}ms ${animationDef.iteration} normal both running`)
    addAnimationStyle(sheet, animationDef)
  }
  return styles.filter(n => n).join(';')
}

function getWorkStyle (work, device) {
  return getBackgroundStyle(work.background)
}

function getSceneStyle (scene, device, stage) {
  const styles = []
  if (scene.background) {
    styles.push(getBackgroundStyle({
      background: scene.background
    }))
  }
  styles.push(`width: ${device.width}px`)
  styles.push(`height: ${device.height}px`)
  if (scene.type === 'background') {
    styles.push(`z-index: 100`)
  } else if (scene.type === 'foreground') {
    styles.push(`z-index: 1000`)
  } else {
    styles.push(`z-index: 101`)
  }
  
  return styles.join(';')
}

async function renderSceneStage (scene, device, stage) {
  let playEnd = 0
  for (let element of scene.elements) {
    if (element.baseUrl) {
      let w = getLength(element.size.width, device)
      let h = getLength(element.size.height, device)
      element.baseUrl = element.baseUrl || element.url
      element.url = 'http://image.danke.fun' + element.baseUrl.replace(/http[s]*:\/\/[^/]+/g, '') + '?x-oss-process=image/format,webp/quality,Q_80/resize,m_fixed,h_' + h + ',w_' + w
    }
    element.style = getElementStyle(element, device, stage)
    if (element.animation[stage].delay + element.animation[stage].duration > playEnd) {
      playEnd = element.animation[stage].delay + element.animation[stage].duration
    }
  }
  await wait(playEnd)
}

export {
  getLength,
  getLenSplits,
  renderSceneStage,
  getElementStyle,
  getWorkStyle,
  getSceneStyle,
  revertLength
}
