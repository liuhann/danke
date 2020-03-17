export default {
  id: '',
  title: '', // 名称 暂时保留使用
  screen: { // 定义时的屏幕大小
    width: 414,
    height: 896
  },
  style: {

  },
  fonts: [{
    name: '华文行楷间',
    url: ''
  }],
  scenes: [{
    id: 'scene-1',
    style: {
      // 背景为类名
      background: {
        color: '#fff',
        name: 'swirly-love',
        variables: []
      }
    }
  },{
    id: 'scene-2',
    style: {
      // 直接指定背景样式
      backgroundColor: '#00bf72',
    },
    elements: [{
      id: 'element-32',
      x: 4,
      y: 23,
      width: 213,
      height: 345,
      // image or svg
      url: '/15011245191/image.jpg',
      // text content
      text: '文本类元素的正文',
      style: {
        // direct style writing
        backgroundColor: '#00bf72',
        // 文字大小
        fontSize: 12,  // px as unit
        // 字体颜色
        color: '#fff',
        // 粗细
        fontWeight: 400,
        // 字间距
        letterSpacing: 4,
        // class style with variables
        background: {
          name: '',
          variables: []
        },
        // 边框样式
        border: {
          name: '',
          variables: []
        },
        svg: {
          name: 'fill',
          variables: [],
        }
      },
      animation: {
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
