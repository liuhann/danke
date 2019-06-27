import { getLength } from '../utils/styles'
export const TextShadows = {
  'inset': 'rgba(255,255,255,0.5) 0px 3px 3px',
  'glowing': '0px 0px 6px rgba(255,255,255,0.7)',
  'hard': '6px 6px 0px rgba(0,0,0,0.2)',
  'double': '4px 3px 0px #fff, 9px 8px 0px rgba(0,0,0,0.15)'
}

export default {
  size: 1,
  spacing: 0,
  color: '#333',
  weight: 'normal',
  align: 'left',
  decoration: 'none',
  style: 'normal',
  shadow: '',
  vertical: false
}

export function getFontStyle ({ font }, device) {
  const styles = []
  if (font) {
    styles.push(`font-size: ${font.size}em`)
    styles.push(`color: ${font.color}`)
    styles.push(`text-align: ${font.align}`)
    styles.push(`font-weight: ${font.weight}`)
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
    if (font.shadow) {
      styles.push(TextShadows[font.shadow])
    }
  }
  return styles
}
