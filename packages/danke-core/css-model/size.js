import { getLength } from '../utils/common'
import { TypeEnum } from '../elements'

export default {
  width: '75vw',
  height: '75vw'
}
export function getSizingStyle (element, device) {
  const styles = []
  if (element.size && device) {
    styles.push(`width: ${getLength(element.size.width, device)}px`)
    if (element.type !== TypeEnum.TEXT) {
      styles.push(`height: ${getLength(element.size.height, device)}px`)
    }
  }
  return styles
}
