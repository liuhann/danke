import POSITION from '../css-model/position'
import ANIMATION from '../css-model/animation'
import SIZE from '../css-model/size'
const PaperFolding = {
  version: '1.2',
  type: 11,
  name: '',
  url: '',
  position: POSITION,
  size: SIZE,
  animation: {
    in: ANIMATION,
    dura: ANIMATION,
    out: ANIMATION
  },
  folding: {
    inc: 100,
    from: [2, 2],
    split: [3, 3]
  }
}
export default PaperFolding
