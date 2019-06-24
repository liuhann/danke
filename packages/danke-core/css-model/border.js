export default {
  width: 1,
  style: 'solid',
  color: '#fafafa',
  radius: 0
}

export function getBorderStyle ({ border }, device) {
  const styles = []
  if (border) {
    if (parseInt(border.width) === 0) {
    } else {
      styles.push(`border: ${border.width}px ${border.style} ${border.color}`)
    }
    styles.push(`border-radius: ${border.radius}px`)
  }
  return styles
}
