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
        duration: 1500
      },
      enter: {
        animation: '',
        duration: 1500
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
        url: '/xjtu2018autumn/home.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 32000,
        anime: {
          easing: 'linear',
          /* from: { clipPath: 'ellipse(100% 0% at -10% -10%)' },*/
          to: { clipPath: 'ellipse(350% 125% at -10% -10%)' },
          leave: { clipPath: 'ellipse(250% 250% at -50% -50%)' }
        }
      }, {
        type: 'typing',
        left: 1.2,
        top: 1.2,
        width: 0.8,
        fontSize: 0.5,
        color: '#fff',
        config: {
          duration: 1000,
          easing: 'linear',
          animationIn: 'bounceUp',
          delay: 300
        },
        text: '秋风吹渭水 落叶满长安'
      }]
    }
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/xjtu2018autumn/home2.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 24000,
        anime: {
          easing: 'linear',
          from: { clipPath: 'ellipse(100% 0% at -10% -10%)' },
          to: { clipPath: 'ellipse(350% 125% at -10% -10%)' },
          leave: { clipPath: 'ellipse(250% 250% at -50% -50%)' }
        }
      }, {
        type: 'typing',
        left: 2,
        top: 11,
        fontSize: 0.4,
        color: '#fff',
        config: {
          duration: 600,
          easing: 'linear',
          delay: 0
        },
        delay: 1000,
        animationIn: 'bounceUp',
        text: '你来时的九月'
      }, {
        type: 'typing',
        left: 2,
        top: 12,
        fontSize: 0.4,
        color: '#fff',
        config: {
          duration: 600,
          easing: 'linear',
          delay: 0
        },
        delay: 3000,
        animationIn: 'bounceUp',
        text: '是夏末惊鸿一瞥'
      }, {
        type: 'typing',
        left: 2,
        top: 13,
        fontSize: 0.4,
        color: '#fff',
        config: {
          duration: 600,
          easing: 'linear',
          delay: 0
        },
        delay: 5000,
        animationIn: 'bounceUp',
        text: '此刻秋风乍起'
      }, {
        type: 'typing',
        left: 2,
        top: 14,
        fontSize: 0.4,
        color: '#fff',
        config: {
          duration: 600,
          easing: 'linear',
          delay: 0
        },
        delay: 8000,
        animationIn: 'bounceUp',
        text: '最美的不是繁花'
      }, {
        type: 'typing',
        left: 2,
        top: 15,
        fontSize: 0.6,
        color: '#fff',
        config: {
          duration: 600,
          easing: 'linear',
          delay: 0
        },
        delay: 12000,
        animationIn: 'bounceUp',
        text: '是仙交梧叶纷飞'
      }]
    }
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/xjtu2018autumn/home.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 32000,
        anime: {
          easing: 'linear',
          /* from: { clipPath: 'ellipse(100% 0% at -10% -10%)' },*/
          to: { clipPath: 'ellipse(350% 125% at -10% -10%)' },
          leave: { clipPath: 'ellipse(250% 250% at -50% -50%)' }
        }
      }, {
        type: 'typing',
        left: 1.2,
        top: 1.2,
        width: 0.8,
        fontSize: 0.5,
        color: '#fff',
        config: {
          duration: 1000,
          easing: 'linear',
          animationIn: 'bounceUp',
          delay: 300
        },
        text: '秋风吹渭水 落叶满长安'
      }]
    }
  }, ],
  transitions: [{
    to: 0,
    effect: 'empty'
  }, {
    from: 0,
    to: 1,
    trigger: {
      delay: 5000
    },
    effect: 'delay'
  }, {
    from: 1,
    to: 2,
    trigger: {
      delay: 20000
    },
    effect: 'fade'
  }]
}
