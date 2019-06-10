import { getLength } from '../utils/common'
import { TypeEnum } from '../elements'

export default {
  type: 'absolute',
  horizontal: 'center',
  vertical: 'center',
  offsetX: '0vw',
  offsetY: '0vw'
}
export const horizontalOptions = [{
  key: 'left',
  value: '左'
}, {
  key: 'center',
  value: '居中'
}, {
  key: 'right',
  value: '右'
}]
export const verticalOptions = [{
  key: 'top',
  value: '上'
}, {
  key: 'center',
  value: '居中'
}, {
  key: 'bottom',
  value: '下'
}]

export function getPositionStyle (element, device) {
  const styles = []
  if (element.position && device) {
    styles.push(`position: absolute`)
    if (element.position.vertical === 'top') {
      styles.push(`top: ${getLength(element.position.offsetY, device)}px`)
    } else if (element.position.vertical === 'center') {
      styles.push(`top: ${device.height / 2 - getLength(element.size.height, device) / 2 + getLength(element.position.offsetY, device)}px`)
    } else if (element.position.vertical === 'bottom') {
      styles.push(`bottom: ${getLength(element.position.offsetY, device)}px`)
    }
    if (element.position.horizontal === 'left') {
      styles.push(`left: ${getLength(element.position.offsetX, device)}px`)
    } else if (element.position.horizontal === 'center') {
      styles.push(`left: ${(device.width / 2) - (getLength(element.size.width, device) / 2) + getLength(element.position.offsetX, device)}px`)
    } else if (element.position.horizontal === 'right') {
      styles.push(`right: ${getLength(element.position.offsetX, device)}px`)
    }
  }
  return styles
}