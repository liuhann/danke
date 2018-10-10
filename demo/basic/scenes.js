export default {
  default: {
    auto: 2000,
    transition: {
      enter: {
        animation: 'scaleIn',
        duration: 300
      },
      leave: {
        animation: 'zoomOut',
        duration: 300
      }
    }
  },
  scenes: [{
    template: 'center-text',
    data: {
      text: '你好'
    }
  }, {
    template: 'center-text',
    auto: false,
    data: {
      text: '看见拉风的事',
      clickNext: 2
    }
  }, {
    template: 'center-text',
    data: {
      text: '发的是发动机旅客'
    }
  }, {
    template: 'center-text',
    data: {
      text: '发的烧录卡家乐福开始的'
    }
  }]
}
