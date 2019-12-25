export default {
  blur: 0,
  opacity: 1,
  grayscale: 0
}

export function getFilterStyle ({ filter }, device) {
  const styles = []
  const filtered = []
  if (filter) {
    if (filter.blur > 0) {
      filtered.push(`blur(${filter.blur}px)`)
    }
    if (filter.grayscale) {
      filtered.push(`grayscale(${filter.grayscale})`)
    }
    if (filter.opacity != null) {
      styles.push(`opacity: ${filter.opacity}`)
    }
  }
  if (filtered.length) {
    styles.push('filter:' + filtered.join(' '))
  }
  return styles
}
