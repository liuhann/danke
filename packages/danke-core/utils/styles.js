import { getLenSplits, getLength, wait } from '../../utils/common'

import { getBoxShadowStyle, getTextShadowStyle } from '../css-model/shadow'
import { getFontStyle } from '../css-model/font'
import { getBackgroundStyle } from '../css-model/background'
import { getBorderStyle } from '../css-model/border'
import { getClipPathStyle } from '../css-model/clippath'
import { getTransformStyle } from '../css-model/transform'
import { getShapeStyle } from '../css-model/shapeclip'
import { createSheet, addAnimationStyle } from '../../frames/keyframe'
import { getPositionStyle } from '../css-model/position'
import { getSizingStyle } from '../css-model/size'
import { sceneTypeEnum } from '../elements/scene'
import { getMaskStyle } from '../css-model/mask'
import { getFilterStyle } from '../css-model/filter'

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

async function checkWebpFeature (feature) {
  return new Promise((resolve, reject) => {
    var kTestImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
    }
    // eslint-disable-next-line no-undef
    var img = new Image()
    img.onload = function () {
      var result = (img.width > 0) && (img.height > 0)
      resolve(result)
    }
    img.onerror = function () {
      resolve(false)
    }
    img.src = 'data:image/webp;base64,' + kTestImages[feature]
  })
}

let sheet = createSheet()
let supportWebP = true
checkWebpFeature('lossy').then((feature) => {
  // supportWebP = feature
})

/**
 * 获取整个元素的样式
 * @param element
 * @param device
 * @param stage
 * @returns {string}
 */
function getElementStyle (element, device, stage) {
  let styles = []
  // position and size
  styles = styles.concat(getPositionStyle(element, device))
    .concat(getSizingStyle(element, device))
    .concat(getBoxShadowStyle(element, device))
    .concat(getTextShadowStyle(element))
    .concat(getFontStyle(element, device))
    .concat(getBorderStyle(element, device))
    .concat(getBackgroundStyle(element, device))
    .concat(getClipPathStyle(element, device))
    .concat(getTransformStyle(element, device))
    .concat(getShapeStyle(element, device))
    .concat(getFilterStyle(element, device))

  // 渲染相对于场景的动画
  styles.push(getAnimationStyle(element, stage, true))
  return styles.filter(n => n).join(';')
}

/**
 * 获取元素的动画样式
 * outer 是否为外渲染，true表示容器样式， false表示内部元素样式
 */
function getAnimationStyle (element, stage, outer) {
  // 渲染相对于场景的动画
  if (stage) {
    if (element.animations) {
      const animationsOrdered = []
      // 支持多个动画次序或者重叠播放
      for (let animation of element.animations) {
        // 动画溢出时 写到element上 还是写在内部渲染上
        // 例如 图片渲染时  <div><img>这样的标签结构， overflow=true时才写入div 否则写入img
        if (animation.stage === stage) {
          if (animation.overflow == null || outer === animation.overflow) {
            animationsOrdered.push(`${animation.name} ${animation.duration}ms ${animation.timing} ${animation.delay || 0}ms ${animation.infinite ? 'infinite' : animation.iteration} both`)
            // 动态写入css
            addAnimationStyle(sheet, animation)
          }
        }
      }
      if (animationsOrdered.length) {
        return `animation: ${animationsOrdered.join(',')}`
      } else {
        return ''
      }
    }
  }
  //
  // if (stage && element.animation[stage] && element.animation[stage].name) {
  //   const animationDef = element.animation[stage]
  //   addAnimationStyle(sheet, animationDef)
  //   return `animation: ${animationDef.name} ${animationDef.duration}ms ${animationDef.timing} ${animationDef.delay}ms ${animationDef.iteration} normal both running`
  // }
}

/**
 * 获取元素内部样式 目前用于情况：
 * - 图片的遮罩
 * @param element
 * @param device
 * @param animation
 */
function getElementInnerStyle (element, device, stage) {
  let styles = []
  styles = styles.concat(getMaskStyle(element, device))
  styles.push(getAnimationStyle(element, stage, false))
  return styles.filter(n => n).join(';')
}

function getWorkStyle (work, device) {
  return getBackgroundStyle(work.background)
}

function getSceneStyle (scene, device, stage, fontRatio = 1) {
  const styles = []
  if (scene.background) {
    styles.push(getBackgroundStyle({
      background: scene.background
    }))
  }
  styles.push(`width: ${device.width}px`)
  styles.push(`height: ${device.height}px`)
  styles.push(`font-size: ${device.width / 30 * fontRatio}px`)
  switch (scene.type) {
    case sceneTypeEnum.COMMON:
      styles.push(`z-index: ${100 + parseInt(scene.z)}`)
      break
    case sceneTypeEnum.BACKGROUND:
      styles.push(`z-index: 100`)
      break
    case sceneTypeEnum.FORGROUND:
      styles.push(`z-index: 9999`)
      break
    default:
      break
  }
  styles.push(getAnimationStyle(scene, stage, true))
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

const DANKE_IMG_CDN = `http://image.danke.fun/`

function getImageWebUrl (element, device) {
  // 对于SVG类型图片的特殊处理
  if (element.svg) {
    let svgBlob = new Blob([element.svg], { type: 'image/svg+xml;charset=utf-8' })
    let domURL = self.URL || self.webkitURL || self
    let url = domURL.createObjectURL(svgBlob)
    element.url = url
    return element.url
  }
  let w = getLength(element.size.width, device)
  let h = getLength(element.size.height, device)
  element.url = element.imgPath ? `${DANKE_IMG_CDN}${element.imgPath}` : element.url
  if (element.url.endsWith('.svg')) {
    return element.url
  }
  if (supportWebP) {
    element.url = element.url + '?x-oss-process=image/format,webp/quality,Q_80/resize,m_fill,h_' + (h * 2) + ',w_' + (w * 2)
  } else {
    element.url = element.url + '?x-oss-process=image/format,jpg/quality,Q_80/resize,m_fill,h_' + (h * 2) + ',w_' + (w * 2)
  }
  return element.url
}

export {
  getLength,
  getLenSplits,
  renderSceneStage,
  getElementStyle,
  getAnimationStyle,
  getWorkStyle,
  getSceneStyle,
  getImageWebUrl,
  revertLength,
  getElementInnerStyle
}
