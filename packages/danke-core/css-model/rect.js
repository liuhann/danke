export default {
  x: 0,
  y: 0,
  width: 100,
  height: 200
}

export function getRectStyle ({ rect }) {
  const styles = []
  styles.push(`left: ${rect.x}px`)
  styles.push(`top: ${rect.y}px`)
  styles.push(`width: ${rect.width}px`)
  styles.push(`height: ${rect.height}px`)
  return styles
}
