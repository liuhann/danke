export default {
  type: 'around',
  blur: 6
}

export const shadowType = {
  'bottom': '下方',
  'around': '四边'
}

export function getShadowStyle ({ shadow }) {
  if (!shadow) {
    return []
  }
  if (shadow.type === 'around') {
    return [`box-shadow: 0px 0px ${shadow.blur}px 0px rgba(0,0,0,0.4)`]
  } else if (shadow.type === 'bottom') {
    return [`box-shadow: 0px 10px ${shadow.blur}px -7px rgba(0,0,0,0.4)`]
  }
}
