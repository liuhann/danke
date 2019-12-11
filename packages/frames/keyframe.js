import { getElementStyle } from '../danke-core/utils/styles'

function createSheet (id) {
  // Create the <style> tag
  var style = document.createElement('style')
  if (id) {
    style.id = id
  }
  // Add a media (and/or media query) here if you'd like!
  // style.setAttribute("media", "screen")
  // style.setAttribute("media", "only screen and (max-width : 1024px)")

  // WebKit hack :(
  style.appendChild(document.createTextNode(''))

  // Add the <style> element to the page
  document.head.appendChild(style)
  return style.sheet
}

function addKeyFrames (sheet, name, frames) {
  let pos = sheet.length
  const rule = '@keyframes ' + name + '{' + frames + '}'
  sheet.insertRule(rule, pos)
}

/**
  animation: focus-in-expand-fwd 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
 * @param animation
 */
function addAnimation (sheet, animation) {
  let pos = sheet.length
  const rule = `.${animation.name} {
    animation: ${animation.name} ${animation.duration}ms ${animation.timing} ${animation.infinite ? 'infinite' : animation.iteration} both
  }`
  sheet.insertRule(rule, pos)
}

function addStyle (sheet, styleText) {
  let pos = sheet.length
  sheet.insertRule(styleText, pos)
}

function generateKeyFrames (frames) {
  const framesInline = []
  for (let frame of frames) {
    framesInline.push(`${frame.percent}%{${getElementStyle(frame)}}\n`)
  }
  return framesInline.join('')
}

function clearAnimation (sheet) {
  document.head.removeChild(sheet.ownerNode)
}

function addAnimationStyle (sheet, animation) {
  if (animation.name) {
    if (animation.cssFrame) {
      addKeyFrames(sheet, animation.name, animation.cssFrame)
    } else if (animation.frames) {
      addKeyFrames(sheet, animation.name, generateKeyFrames(animation.frames))
    }
    if (animation.svgFilter) {
      document.body.insertAdjacentHTML('beforeend', animation.svgFilter)
    }
    addAnimation(sheet, animation)
  }
}

function getAnimationSourceCode (sheet, animation) {
  let frames = ''
  if (animation.cssFrame) {
    frames = animation.cssFrame
  } else {
    frames = generateKeyFrames(animation.frames)
  }
  return `.${animation.name} {
    animation: ${animation.name} ${animation.duration}ms ${animation.timing} ${animation.infinite ? 'infinite' : animation.iteration} both
  }
  @keyframes ${animation.name} {
    ${frames}
  }`
}

export {
  addStyle,
  createSheet,
  clearAnimation,
  addAnimationStyle,
  getAnimationSourceCode
}
