import BACKGROUND from './background'
import BORDER from './border'
import FONT from './font'
import CLIPPATH from './clippath'
import POSITION from './position'
import SIZE from './size'
import ANIMATION from './animation'

const BASE = {
  version: '1.2',
  name: '元素',
  text: '',
  desc: '',
  url: '',
  position: POSITION,
  background: BACKGROUND,
  border: BORDER,
  font: FONT,
  clip: CLIPPATH,
  size: SIZE,
  in: ANIMATION,
  dura: ANIMATION,
  out: ANIMATION
}

function simplify (element, template) {
  const simplyfied = {}
  if (!template) {
    template = BASE
  }
  for (let key in template) {
    if (Array.isArray(template[key])) {
      if (template[key].join(' ') !== element[key].join(' ')) {
        simplyfied[key] = element[key]
      }
    } else if (typeof template[key] === 'object') {
      const simp = simplify(element[key], template[key])
      if (Object.entries(simp).length > 0) {
        simplyfied[key] = simp
      }
    } else if (typeof template[key] === 'number' || typeof template[key] === 'boolean' || typeof template[key] === 'string') {
      if (template[key] !== element[key]) {
        simplyfied[key] = element[key]
      }
    }
  }
  return simplyfied
}
export default BASE

export { simplify }
