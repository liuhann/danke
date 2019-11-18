import POSITION from '../css-model/position'
import SIZE from '../css-model/size'
import ANIMATION from '../css-model/animation'
import FONT from '../css-model/font'
import SHADOW from '../css-model/shadow'
const text = {
  version: '1.2',
  type: 2,
  text: '',
  font: FONT,
  position: POSITION,
  size: SIZE,
  shadow: SHADOW,
  className: '',
  animation: {
    in: ANIMATION,
    dura: ANIMATION,
    out: ANIMATION
  }
}
export default text
