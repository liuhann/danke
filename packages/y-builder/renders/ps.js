export default function getPositionStyle (element) {
  const styles = []
  styles.push(`left: ${element.left}px`)
  styles.push(`top: ${element.top}px`)
  styles.push(`width: ${element.width}px`)
  styles.push(`height: ${element.height}px`)
  return styles
}
