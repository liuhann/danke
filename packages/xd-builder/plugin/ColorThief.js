import ColorThief from 'color-thief'
import DeltaE from 'delta-e'
import { ChinaColors, rgb2lab } from '../../utils/colors'

const colorThief = new ColorThief()

/**
 * 根据RGB颜色获取最近的中国色
 * @param rgbColor
 * @return {{CMYK: number[], pinyin: string, name: string, hex: string, RGB: number[], LAB: number[]}|{CMYK: number[], pinyin: string, name: string, hex: string, RGB: number[], LAB: number[]}|{CMYK: number[], pinyin: string, name: string, hex: string, RGB: number[], LAB: number[]}|{CMYK: number[], pinyin: string, name: string, hex: string, RGB: number[], LAB: number[]}|{CMYK: number[], pinyin: string, name: string, hex: string, RGB: number[], LAB: number[]}}
 */
function getNearbyChinaColor (rgbColor) {
  const lab = rgb2lab(rgbColor)
  let min = DeltaE.getDeltaE00({
    L: lab[0], A: lab[1], B: lab[2]
  }, {
    L: ChinaColors[0].RGB[0], A: ChinaColors[0].RGB[1], B: ChinaColors[0].RGB[2]
  })
  let minChinaColor = ChinaColors[0]

  for (let chinaColor of ChinaColors) {
    let current = DeltaE.getDeltaE00({
      L: lab[0], A: lab[1], B: lab[2]
    }, {
      L: chinaColor.RGB[0], A: chinaColor.RGB[1], B: chinaColor.RGB[2]
    })
    if (current < min) {
      min = current
      minChinaColor = chinaColor
    }
  }
  return minChinaColor
}

/**
 * 计算图片元素的颜色
 * @param element
 */
function calculateElementColors (element) {
  if (element.url) {
    const img = new Image(500, 500)
    img.addEventListener('load', () => {
      const paletteColors = colorThief.getPalette(img, 10)
      const colors = []
      for (let color of paletteColors) {
        colors.push(getNearbyChinaColor(color))
      }
      element.colors = colors
    })
    img.src = element.url
  }
}

export default {
  elementInserted (element) {
    calculateElementColors(element)
  },
  elementUpdated (element) {
    debugger
    calculateElementColors(element)
  }
}
