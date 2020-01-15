import { getLength } from '../utils/common'
export default {
  horizontal: 'center',
  vertical: 'center',
  offsetX: '0vw',
  offsetY: '0vw'
}
export const horizontalOptions = [{
  key: 'left',
  value: '距左'
}, {
  key: 'center',
  value: '正中'
}, {
  key: 'right',
  value: '距右'
}]
export const verticalOptions = [{
  key: 'top',
  value: '距上'
}, {
  key: 'center',
  value: '正中'
}, {
  key: 'bottom',
  value: '距下'
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
