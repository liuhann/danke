import { getLength } from '../utils/styles'
export default {
  size: 1,
  spacing: 0,
  color: '#333',
  bold: false,
  align: 'left',
  valign: 'center',
  decoration: 'none',
  style: 'normal',
  vertical: false
}

export function getFontStyle ({ font }, device) {
  const styles = []
  if (font) {
    styles.push(`font-size: ${font.size}em`)
    styles.push(`color: ${font.color}`)
    styles.push(`text-align: ${font.align}`)
    if (font.bold) {
      styles.push(`font-weight: bold`)
    }
    styles.push(`letter-spacing: ${font.spacing}px`)
    if (font.decoration) {
      styles.push(`text-decoration: ${font.decoration}`)
    }
    if (font.padding) {
      styles.push(`padding: ${getLength(font.padding, device)}px`)
    }
    if (font.vertical) {
      styles.push(`writing-mode: vertical-lr`)
    }
    if (font.valign) {
      styles.push(`align-items: ${font.valign}`)
    }
  }
  return styles
}
