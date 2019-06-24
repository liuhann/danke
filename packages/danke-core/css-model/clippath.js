export default {
  type: 'none',
  points: []
}
export const CLIPS = [{
  key: 'rect',
  value: '方形',
}, {
  key: 'circle',
  value: '圆形',
  clip: 'clip-path: ellipse(50% 50% at 50% 50%)'
}, {
  key: 'rhombus',
  value: '菱形',
  clip: 'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
}, {
  key: 'pentagon',
  value: '五边形',
  clip: 'clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
}, {
  key: 'hexagon',
  value: '六边形',
  clip: 'clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
}]

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
