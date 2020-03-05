import { shortid } from '../utils/string'

export default {
  id: '',
  title: '', // 名称 暂时保留使用
  screen: { // 定义时的屏幕大小
    width: 414,
    height: 896
  },
  style: {

  },
  scenes: [{
    id: 'scene-1',
    style: {
      multiBackground: {
        name: 'swirly-love'
      }
    }
  },{
    id: 'scene-2',
    style: {
      background: '#CE2299',
    },
    elements: [{
      id: 'xxewe',
      url: '/15011245191/ddee.jpg',
      x: 4,
      y: 23,
      width: 213,
      height: 345,
      style: {

      }
    }],
    z: 100
  }]
}
