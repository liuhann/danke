export const Shapes = [{
  key: 'rect',
  value: '方形'
}, {
  key: 'circle',
  value: '圆形'
}, {
  key: 'rhombus',
  value: '菱形'
}, {
  key: 'pentagon',
  value: '五边形'
}, {
  key: 'hexagon',
  value: '六边形'
}]

export function getShapeStyle ({ shape }, device) {
  const styles = []
  if (shape) {
    switch (shape) {
      case 'circle':
        styles.push('clip-path: ellipse(50% 50% at 50% 50%)')
        break
      case 'rhombus':
        styles.push('clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)')
        break
      case 'pentagon':
        styles.push('clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)')
        break
      case 'hexagon':
        styles.push('clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)')
    }
  }
  return styles
}
