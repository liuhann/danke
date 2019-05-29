import BACKGROUND from '../css-model/background'
import BORDER from '../css-model/border'
import CLIPPATH from '../css-model/clippath'
import POSITION from '../css-model/position'
import SIZE from '../css-model/size'
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
  animation: {
    in: ANIMATION,
    dura: ANIMATION,
    out: ANIMATION
  }
}
export default image
