import BORDER from '../css-model/border'
import POSITION from '../css-model/position'
import BACKGROUND from '../css-model/background'
import SIZE from '../css-model/size'
import ANIMATION from '../css-model/animation'

const shape = {
  version: '1.2',
  type: 3,
  shape: 'rect',
  name: '',
  position: POSITION,
  background: BACKGROUND,
  border: BORDER,
  size: SIZE,
  animation: {
    in: ANIMATION,
    dura: ANIMATION,
    out: ANIMATION
  }
}

export const ShapeType = {
  'rect': '圆形',

}
export default shape

