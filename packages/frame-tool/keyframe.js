import { getElementStyle } from 'style-editor/src/utils/styles'

function createSheet () {
  // Create the <style> tag
  var style = document.createElement('style')
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
  console.log(sheet)
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

function generateKeyFrames (frames) {
  const framesInline = []
  for (let frame of frames) {
    framesInline.push(`${frame.percent}%{${getElementStyle(frame)}}`)
  }
  return framesInline.join('')
}

function clearAnimation (sheet) {
  document.head.removeChild(sheet.ownerNode)
}

function addAnimationStyle (sheet, animation) {
  addKeyFrames(sheet, animation.name, generateKeyFrames(animation.frames))
  addAnimation(sheet, animation)
}

export {
  createSheet,
  clearAnimation,
  addAnimationStyle
}
