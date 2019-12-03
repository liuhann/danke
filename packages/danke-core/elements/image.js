import BACKGROUND from '../css-model/background'
import BORDER from '../css-model/border'
import CLIPPATH from '../css-model/clippath'
import POSITION from '../css-model/position'
import SIZE from '../css-model/size'
import SHADOW from '../css-model/shadow'
import ANIMATION from '../css-model/animation'
import MASK from '../css-model/mask'
import FILTER from '../css-model/filter'
import { resumeCompare, trimCompare } from '../utils/common'
const image = {
  version: '1.2',
  type: 1,
  name: '',
  desc: '',
  url: '',
  position: POSITION,
  border: BORDER,
  clip: CLIPPATH,
  size: SIZE,
  filter: FILTER,
  shadow: SHADOW,
  mask: MASK,
  className: '',
  animations: []
}

export function trim (image) {
  return {
    version: image.version,
    type: image.type,
    name: image.name,
    desc: image.desc,
    url: image.url,
    position: trimCompare(image.position, POSITION),
    background: trimCompare(image.background, BACKGROUND),
    border: trimCompare(image.border, BORDER),
    clip: image.clip,
    size: image.size,
    shadow: trimCompare(image.shadow, SHADOW),
    animation: {
      in: trimCompare(image.animation.in, ANIMATION),
      dura: trimCompare(image.animation.dura, ANIMATION),
      out: trimCompare(image.animation.out, ANIMATION)
    }
  }
}

export function resume (image) {
  return {
    version: image.version,
    type: image.type,
    name: image.name,
    desc: image.desc,
    url: image.url,
    position: resumeCompare(image.position, POSITION),
    background: resumeCompare(image.background, BACKGROUND),
    border: resumeCompare(image.border, BORDER),
    clip: image.clip,
    size: image.size,
    shadow: resumeCompare(image.shadow, SHADOW),
    animation: {
      in: resumeCompare(image.animation.in, ANIMATION),
      dura: resumeCompare(image.animation.dura, ANIMATION),
      out: resumeCompare(image.animation.out, ANIMATION)
    }
  }
}
export default image
