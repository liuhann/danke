export const Shapes = [{
  key: 'rect',
  value: '方形'
}, {
  key: 'circle',
  value: '圆形'
}]

export function getShapeStyle ({ shape }, device) {
  const styles = []
  if (shape) {
    switch (shape) {
      case 'circle':
        styles.push('border-radius: 50% 50%')
        break
      default:
        break
    }
  }
  return styles
}
