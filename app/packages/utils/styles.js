function getElementStyle (element) {
  const styles = []

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
