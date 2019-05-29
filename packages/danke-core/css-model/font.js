import { getLength } from '../utils/styles'

export default {
  padding: 0,
  size: 1,
  spacing: 0,
  color: '#333',
  weight: 'normal',
  align: 'left',
  decoration: 'none',
  style: 'normal'
}

export function getFontStyle ({ font }, device) {
  const styles = []
  if (font) {
    styles.push(`font-size: ${font.size}em`)
    styles.push(`color: ${font.color}`)
    styles.push(`text-align: ${font.align}`)
    styles.push(`font-weight: ${font.weight}`)
    styles.push(`letter-spacing: ${font.spacing}px`)
    styles.push(`text-decoration: ${font.decoration}px`)
    styles.push(`padding: ${getLength(font.padding, device)}px`)
  }
  return styles
}
