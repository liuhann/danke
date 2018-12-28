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
