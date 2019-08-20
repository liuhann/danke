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
  title: '靠上半屏',
  value: {
    position: {
      type: 'absolute',
      horizontal: 'center',
      vertical: 'top',
      offsetX: '0vw',
      offsetY: '2vh'
    },
    size: {
      width: '90vw',
      height: '50vh'
    }
  }
}]
export default layout
