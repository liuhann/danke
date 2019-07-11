import POSITION from '../css-model/position'
import BACKGROUND from '../css-model/background'
import SIZE from '../css-model/size'
import ANIMATION from '../css-model/animation'
import BORDER from '../css-model/border'
import SHADOW from '../css-model/shadow'
const shape = {
  version: '1.2',
  type: 3,
  shape: 'rect',
  name: '',
  position: POSITION,
  size: SIZE,
  background: BACKGROUND,
  border: BORDER,
  shadow: SHADOW,
  animation: {
    in: ANIMATION,
    dura: ANIMATION,
    out: ANIMATION
  }
}
export default shape
