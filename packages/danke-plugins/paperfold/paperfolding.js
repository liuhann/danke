import POSITION from '../../danke-core/css-model/position'
import SIZE from '../../danke-core/css-model/size'
const PaperFolding = {
  version: '1.2',
  type: 1001,
  name: '图片折叠',
  url: '',
  position: POSITION,
  size: SIZE,
  animations: [],
  folding: {
    inc: 100,
    from: [2, 2],
    split: [3, 3]
  }
}
export default PaperFolding
