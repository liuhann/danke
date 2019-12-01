export default {
  colors: ['rgba(0,0,0,0)'],
  angle: 'to bottom',
  url: '',
  size: 'cover',
  position: 'center center',
  repeat: true,
  blend: 'multiply'
}

/**
* 获取背景样式，支持背景图片及颜色、多见变色的混合
*/
export function getBackgroundStyle ({ background, url }) {
  const styles = []
  if (background && !url) {
    const backgroundImages = []
    let bgUrl = url || background.url
    if (bgUrl) {
      backgroundImages.push(`url('${bgUrl}')`)
    }
    // 多重颜色的处理
    if (background.colors) {
      let colors = background.colors.filter(e => e === 0 || e)
      if (colors.length > 1) {
        backgroundImages.push(`linear-gradient(${background.angle || 'to bottom'}, ${background.colors.join(',')})`)
      } else if (colors.length === 1) {
        styles.push(`background-color: ${colors[0]}`)
      }
    }
    if (backgroundImages.length) {
      styles.push(`background-image: ${backgroundImages.join(',')}`)
    }
    // 背景图片的处理
    if (bgUrl) {
      styles.push(`background-size: ${background.size}`)
      styles.push(`background-position: ${background.position}`)
      if (background.repeat) {
        styles.push(`background-repeat: repeat`)
      } else {
        styles.push(`background-repeat: no-repeat`)
      }
      styles.push(`background-blend-mode: ${background.blend}`)
    }
  }
  return styles
}
