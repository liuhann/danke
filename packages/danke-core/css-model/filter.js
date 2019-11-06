export default {
  blur: 0,
  grayscale: 0
}

export function getFilterStyle ({ filter }, device) {
  const filtered = []
  if (filter) {
    if (filter.blur > 0) {
      filtered.push(`blur(${filter.blur}px)`)
    }
    if (filter.grayscale) {
      filtered.push(`grayscale(${filter.grayscale})`)
    }
  }
  if (filtered.length) {
    return ['filter:' + filtered.join(' ')]
  } else {
    return []
  }
}
