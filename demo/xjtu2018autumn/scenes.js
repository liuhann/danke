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
  resources: [{
    type: 'image',
    url: '/xjtu2018autumn/home.jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/home2.jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/a1jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/a2.jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/a2.jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/a4.jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/b1.jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/b2.jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/b3.jpg'
  }, {
    type: 'image',
    url: '/xjtu2018autumn/b4.jpg'
  }],
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
        duration: 10000,
        anime: {
          easing: 'linear',
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
          duration: 400,
          easing: 'linear',
          animationIn: 'bounceUp',
          delay: 100
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
        duration: 10000,
        anime: {
          duration: 500,
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
        delay: 1500,
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
        delay: 2000,
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
        delay: 2500,
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
        delay: 3500,
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
        url: '/xjtu2018autumn/a2.jpg',
        left: 0,
        top: 6,
        height: 14,
        width: 10,
        duration: 32000,
        anime: {
          easing: 'linear'
        }
      }, {
        type: 'image',
        url: '/xjtu2018autumn/a1.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 32000,
        anime: {
          easing: 'linear',
          from: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
          to: { clipPath: 'polygon(0 0, 100% 0, 100% 36%, 0 50%)' },
          leave: { clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)' }
        }
      }, {
        type: 'typing',
        left: 3,
        top: 10,
        width: 7,
        fontSize: 1,
        color: '#fff',
        config: {
          duration: 1000,
          easing: 'linear',
          animationIn: 'bounceUp',
          delay: 300
        },
        text: '层林尽染'
      }]
    }
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/xjtu2018autumn/a3.jpg',
        left: 0,
        top: 6,
        height: 14,
        width: 10,
        duration: 32000,
        anime: {
          easing: 'linear',
          from: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
          to: { clipPath: 'polygon(0 15%, 100% 0%, 100% 100%, 0 100%)' },
          leave: { clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)' }
        }
      }, {
        type: 'image',
        url: '/xjtu2018autumn/a4.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 32000,
        anime: {
          easing: 'linear',
          from: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
          to: { clipPath: 'polygon(0 0, 100% 0, 100% 56%, 0 45%)' },
          leave: { clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)' }
        }
      }, {
        type: 'typing',
        left: 3,
        top: 10,
        width: 7,
        fontSize: 1,
        color: '#fff',
        config: {
          duration: 0,
          delay: 0
        },
        text: '层林尽染'
      }]
    }
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/xjtu2018autumn/b1.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 20000,
        anime: {
          easing: 'linear',
          from: { opacity: 0.5 },
          to: { opacity: 1 },
          leave: { opacity: 0.4 }
        }
      }, {
        type: 'typing',
        left: 4,
        top: 3,
        width: 7,
        fontSize: 0.6,
        color: '#fff',
        config: {
          duration: 400,
          delay: 50
        },
        text: '日光倾城'
      }]
    }
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/xjtu2018autumn/b2.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 20000,
        anime: {
          easing: 'linear',
          from: { opacity: 0.5 },
          to: { opacity: 1 },
          leave: { opacity: 0.4 }
        }
      }, {
        type: 'typing',
        left: 4,
        top: 3,
        width: 7,
        fontSize: 0.6,
        color: '#fff',
        config: {
          duration: 400,
          delay: 50
        },
        text: '霜叶翩然'
      }]
    }
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/xjtu2018autumn/b4.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 20000,
        anime: {
          easing: 'linear',
          from: { opacity: 0.5 },
          to: { opacity: 1 },
          leave: { opacity: 0.4 }
        }
      }, {
        type: 'typing',
        left: 4,
        top: 3,
        width: 7,
        fontSize: 0.6,
        color: '#fff',
        config: {
          duration: 400,
          delay: 50
        },
        text: '胜于繁花'
      }]
    }
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/xjtu2018autumn/b3.jpg',
        left: 0,
        top: 0,
        height: 20,
        width: 10,
        duration: 20000,
        anime: {
          easing: 'linear',
          from: { opacity: 0.5 },
          to: { opacity: 1 },
          leave: { opacity: 0.4 }
        }
      }]
    }
  }, {
    template: 'designed',
    state: '',
    active: {},
    data: {
      elements: [{
        type: 'image',
        url: '/xjtu2018autumn/xjtu.jpg',
        left: 2,
        top: 1,
        height: 10,
        width: 8,
        duration: 200000
      }]
    }
  }],
  transitions: [{
    to: 0,
    effect: 'empty'
  }, {
    from: 0,
    to: 1,
    trigger: {
      delay: 2000
    },
    effect: 'delay'
  }, {
    from: 1,
    to: 2,
    trigger: {
      delay: 5000
    },
    effect: 'delay'
  }, {
    from: 2,
    to: 3,
    trigger: {
      delay: 3000
    },
    effect: 'delay'
  }, {
    from: 3,
    to: 4,
    trigger: {
      delay: 2000
    },
    effect: 'delay'
  }, {
    from: 4,
    to: 5,
    trigger: {
      delay: 2000
    },
    effect: 'delay'
  }, {
    from: 5,
    to: 6,
    trigger: {
      delay: 2000
    },
    effect: 'delay'
  }, {
    from: 6,
    to: 7,
    trigger: {
      delay: 2000
    },
    effect: 'delay'
  }, {
    from: 7,
    to: 8,
    trigger: {
      delay: 2000
    },
    effect: 'delay'
  }, {
    from: 8,
    to: 9,
    trigger: {
      delay: 2000
    },
    effect: 'delay'
  }]
}
