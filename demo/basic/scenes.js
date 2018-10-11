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
  scenes: [{
    template: 'center-text',
    state: '',
    active: {},
    data: {
      text: 'All VNodes in the component tree must be unique'
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
    effect: 'zoom'
  }, {
    from: 0,
    to: 1,
    trigger: {
      delay: 3000
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
