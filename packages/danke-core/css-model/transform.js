export const transformKeys = [{
  label: '横向拉伸',
  value: 'scaleX'
}, {
  label: '纵向拉伸',
  value: 'scaleY'
}, {
  label: '横向扭曲',
  value: 'skewX'
}, {
  label: '纵向扭曲',
  value: 'skewY'
}, {
  label: '旋转',
  value: 'rotateZ'
}, {
  label: 'X旋转',
  value: 'rotateX'
}, {
  label: 'Y旋转',
  value: 'rotateY'
}]

export const transformValue = {
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0
}

export const transformUnits = {
  skewX: 'deg',
  skewY: 'deg',
  rotateX: 'deg',
  rotateY: 'deg',
  rotateZ: 'deg'
}

export function getTransformStyle ({ transforms }) {
  const seq = []
  if (transforms) {
    for (let transform of transforms) {
      seq.push(`${transform.key}(${transform.value}${transformUnits[transform.key] || ''})`)
    }
  }
  return [`transform: ${seq.join(' ')}`]
}
