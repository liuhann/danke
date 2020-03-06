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
      // 背景为类名
      multiBackground: {
        name: 'swirly-love'
      }
    }
  },{
    id: 'scene-2',
    style: {
      // 直接指定背景样式
      background: '#CE2299',
    },
    elements: [{
      id: 'element-32',
      x: 4,
      y: 23,
      width: 213,
      height: 345,
      // 图片类元素
      url: '/15011245191/image.jpg',
      content: '文本类元素的正文',
      style: {
        // 边框样式
        border: {
          name: '',
          variables: []
        },
        // 进入特效
        enters: [{
          // 名称，供配置展示用
          title: '左侧飞入',
          // css类名称
          name: 'fly-in-left',
          // 过渡函数，默认不许修改
          timing: 'ease-in',
          // 时间区间 [0]为延迟，[1]为持续时间
          range: [0, 600]
        }],
        // 离开特效
        exists: [{
          // 名称，供配置展示用
          title: '右侧飞出',
          // css类名称
          name: 'fly-out-right',
          // 过渡函数，默认不许修改
          timing: 'ease-in',
          // 时间区间 [0]为延迟，[1]为持续时间
          range: [0, 600]
        }]
      }
    }]
  }]
}
