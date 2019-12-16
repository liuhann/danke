import ColorThief from 'color-thief'
import { ChinaColors } from '../../utils/colors'

const colorThief = new ColorThief()
function getNearestByRGB (rgbColor) {
  let result = {
    rgb: rgbColor,
    cn: ''
  }
  let dis = 1000

  for (let chinaColor of ChinaColors) {
    let r = Math.pow(chinaColor.RGB[0] - rgbColor[0], 2) + Math.pow(chinaColor.RGB[1] - rgbColor[1], 2) + Math.pow(chinaColor.RGB[2] - rgbColor[2], 2)
    if (r < dis) {
      dis = r
      result.cn = chinaColor.name
      result.color = chinaColor.hex
    }
  }
  result.rgb = `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`
  return result
}

/**
 * 计算图片元素的颜色
 * @param element
 */
function calculateElementColors (el) {
  const paletteColors = colorThief.getPalette(el, 10)
  const colorsWithName = []
  for (let color of paletteColors) {
    colorsWithName.push(getNearestByRGB(color))
  }
  return colorsWithName
}

export default {
  calculateElementColors
}
