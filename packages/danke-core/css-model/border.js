export default {
  width: 1,
  style: 'solid',
  color: '#fafafa',
  radius: 0
}

export const LINE_STYLES = [{
  key: 'solid',
  value: '实线'
}, {
  key: 'dotted',
  value: '虚点线'
}, {
  key: 'dashed',
  value: '虚划线'
}, {
  key: 'double',
  value: '双层'
}, {
  key: 'none',
  value: '无边框'
}, {
  key: 'inset',
  value: '嵌入线'
}]

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
