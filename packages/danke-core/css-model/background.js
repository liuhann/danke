export default {
  colors: ['#fff'],
  angle: 'to bottom',
  url: '',
  size: 'cover',
  position: 'center center',
  repeat: true,
  blend: 'multiply'
}

export function getBackgroundStyle ({ background, url }) {
  const styles = []
  if (background) {
    const backgroundImages = []
    let bgUrl = url || background.url
    if (bgUrl) {
      backgroundImages.push(`url('${bgUrl}')`)
    }
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
  } else {
    styles.push(`background: transparent`)
  }
  return styles
}
