export default {
  type: 'none',
  points: []
}

export function getClipPathStyle ({ clip }, device) {
  const styles = []
  if (clip) {
    const points = []
    for (let point of clip.points) {
      points.push(`${point[0]}% ${point[1]}%`)
    }
    if (clip.type === 'polygon') {
      styles.push(`clip-path: polygon(${points.join(',')})`)
    } else if (clip.type === 'circle') {
      styles.push(`clip-path: circle(${clip.points[0]}% at ${clip.points[1]}% ${clip.points[2]}%)`)
    } else if (clip.type === 'ellipse') {
      if (points.length === 2) {
        styles.push(`clip-path: ellipse(${points[0]} at ${points[1]})`)
      }
    }
  }
  return styles
}
