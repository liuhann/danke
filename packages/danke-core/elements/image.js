import BACKGROUND from '../css-model/background'
import BORDER from '../css-model/border'
import CLIPPATH from '../css-model/clippath'
import POSITION from '../css-model/position'
import SIZE from '../css-model/size'
import SHADOW from '../css-model/shadow'
import ANIMATION from '../css-model/animation'
const image = {
  version: '1.2',
  type: 1,
  name: '',
  desc: '',
  url: '',
  position: POSITION,
  background: BACKGROUND,
  border: BORDER,
  clip: CLIPPATH,
  size: SIZE,
  shadow: SHADOW,
  animation: {
    in: ANIMATION,
    dura: ANIMATION,
    out: ANIMATION
  }
}

export function resume (image) {
  if (!image.background) {
    image.background = JSON.parse(JSON.stringify(BACKGROUND))
  }
  if (!image.border) {
    image.border = JSON.parse(JSON.stringify(BORDER))
  }
}
export default image
