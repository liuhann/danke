export default {
  effects: {
    empty: {
      leave: {
        duration: 0
      },
      enter: {
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
    delay: {
      leave: {
        animation: '',
        duration: 500
      },
      enter: {
        animation: '',
        duration: 500
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
  grounds: [{
    template: 'designed',
    key: 'fore',
    data: {
      background: '#343436',
      state: '',
      active: {},
      elements: [{
        type: 'image',
        url: '/picture/bg_header_01_mobile.svg',
        left: 0,
        top: 0,
        width: 10,
        height: 20
      }]
    }
  }],
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
        type: 'image',
        url: '/picture/wf.png',
        left: 2,
        top: 10,
        width: 6,
        shape: 'square',
        anime: {
          from: { clipPath: 'ellipse(100% 0% at -20% -20%)' },
          to: { clipPath: 'ellipse(150% 150% at -50% -50%)' },
          leave: { clipPath: 'ellipse(250% 250% at -50% -50%)' }
        },
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
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/picture/bg_header_01_mobile.svg',
        left: 0,
        top: 0,
        width: 10,
        height: 20
      }]
    }
  }],
  transitions: [{
    to: 0,
    effect: 'empty'
  }, {
    to: 4,
    effect: 'empty'
  }, {
    from: 0,
    to: 1,
    trigger: {
      delay: 4000
    },
    effect: 'delay'
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
