import { TypeEnum } from '../elements'
export default {
  x: 0,
  y: 0,
  b: 0,
  i: false,
  color: 'rgba(0,0,0,0.8)'
}
export const boxShadows = {
  'none': '',
  'hover': 'box-shadow: 0px 10px 13px -7px #000000',
  'hard light': 'box-shadow: 5px 5px #333',
  'reduced': 'box-shadow: 0px 8px 6px -6px #666',
  'inset': 'inset 0px 0px 10px #666',
  'glow': 'box-shadow: 0px 0px 10px -2px #FFF',
  'around': 'box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
}

export function getTextShadowStyle ({ shadows }) {
  if (shadows && shadows.length) {
    const shadowList = []
    for (let shadow of shadows) {
      shadowList.push(`${shadow.x}px ${shadow.y}px ${shadow.b}px ${shadow.color} ${shadow.i ? 'inset' : ''}`)
    }
    return [`text-shadow: ${shadowList.join(',')}`]
  }
}

export function getBoxShadowStyle ({ shadow, type }) {
  if (shadow) {
    if (shadow.x === 0 && shadow.y === 0 && shadow.b === 0) {
      return []
    }
    if (type === TypeEnum.TEXT) {
      return [`text-shadow: ${shadow.x}px ${shadow.y}px ${shadow.b}px ${shadow.color} ${shadow.i ? 'inset' : ''}`]
    } else {
      return [`box-shadow: ${shadow.x}px ${shadow.y}px ${shadow.b}px ${shadow.color} ${shadow.i ? 'inset' : ''}`]
    }
  } else {
    return []
  }
}
