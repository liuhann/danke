export default {
  effects: {
    empty: {
      leave: {
        animation: '',
        duration: 0
      },
      enter: {
        animation: '',
        duration: 0
      }
    },
    zoom: {
      leave: {
        animation: 'zoomOut',
        duration: 300
      },
      enter: {
        animation: 'scaleIn',
        duration: 300
      }
    },
    fade: {
      leave: {
        animation: 'fadeOut',
        duration: 300
      },
      enter: {
        animation: 'fadeIn',
        duration: 300
      }
    }
  },
  grid: {
    x: 10,
    y: 20
  },
  scenes: [{
    template: 'designed',
    state: '',
    active: {},
    data: {
      background: '#343436',
      elements: [{
        type: 'typing',
        text: 'hello',
        left: 3,
        top: 5,
        width: 6,
        delay: 1000,
        height: 1
      }, {
        type: 'image1',
        url: '/picture/wf.png',
        left: 2,
        top: 10,
        width: 6,
        shape: 'square',
        clipPath: 'polygon(0 0, 57% 0, 100% 100%, 0% 100%)'
      }, {
        type: 'text-bubble',
        text: '你确定是这样的',
        left: 2,
        top: 3,
        width: 4
      }, {
        delay: 3000,
        type: 'text-bubble',
        text: '当然没问题',
        left: 4,
        top: 14,
        width: 4,
        position: 'bottom-right'
      }]
    }
  }, {
    template: 'center-text',
    state: '',
    active: {},
    auto: false,
    data: {
      text: '看见拉风的事'
    }
  }, {
    template: 'center-text',
    state: '',
    active: {},
    data: {
      text: '发的是发动机旅客'
    }
  }, {
    template: 'center-text',
    state: '',
    active: {},
    data: {
      text: '发的烧录卡家乐福开始的'
    }
  }],
  transitions: [{
    to: 0,
    effect: 'empty'
  }, {
    from: 0,
    to: 1,
    trigger: {
      delay: 3000000
    },
    effect: 'fade'
  }, {
    from: 1,
    to: 2,
    trigger: {
      event: 'click'
    },
    effect: 'empty'
  }, {
    from: 2,
    to: 3,
    trigger: {
      delay: 3000
    },
    effect: 'zoom'
  }]
}
