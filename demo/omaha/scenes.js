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
  scenes: [{
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/omaha/bush-1.png',
        left: 2,
        top: 10,
        height: 1,
        anime: {
          from: { clipPath: 'ellipse(100% 0% at -20% -20%)' },
          to: { clipPath: 'ellipse(150% 150% at -50% -50%)' },
          leave: { clipPath: 'ellipse(250% 250% at -50% -50%)' }
        },
        clipPath: 'polygon(0 0, 57% 0, 100% 100%, 0% 100%)'
      }]
    }
  }],
  transitions: [{
    to: 0,
    effect: 'empty'
  }]
}
