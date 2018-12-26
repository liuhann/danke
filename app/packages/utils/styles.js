function getElementStyle (element) {
  const styles = []

  if (element.background.mode === '1') {
    styles.push(`background-color: ${element.background.color}`)
  } else if (element.background.mode === '2') {
    if (element.src) {
      styles.push(`background-image: linear-gradient(${element.background.angle}, ${element.background.gradient[0]}, ${element.background.gradient[1]}), url('${element.src}')`)
    } else {
      styles.push(`background-image: linear-gradient(${element.background.angle}, ${element.background.gradient[0]}, ${element.background.gradient[1]})`)
    }
  } else if (element.background.mode === '0') {
    styles.push(`background: transparent`)
  }
  return styles.join(';')
}

export default {
  getElementStyle
}
