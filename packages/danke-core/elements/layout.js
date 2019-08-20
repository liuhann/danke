import CLIPPATH from '../css-model/clippath'
import POSITION from '../css-model/position'
import SIZE from '../css-model/size'
import ANIMATION from '../css-model/animation'
const layout = {
  version: '1.2',
  position: POSITION,
  clip: CLIPPATH,
  size: SIZE,
  animation: {
    in: ANIMATION,
    dura: ANIMATION,
    out: ANIMATION
  }
}
export const templates = [{
  title: '居中'
}]
export default layout
