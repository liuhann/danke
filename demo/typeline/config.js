export default {
  theme: {
    background: {
      type: 'image',
      url: 'img/bg.png'
    }
  },
  scenes: [{
    id: 'start',
    type: 'center-focus-text',
    value: 'Hello',
    next: {
      id: 'scene-1'
    }
  }, {
    id: 'scene-1',
    type: 'center-focus-text',
    value: 'Welcome to use DANKE',
    in: {
      name: 'ZoomIn',
      from: 4,
      to: 2,
      dura: 300
    },
    next: {
      id: 'scene-2'
    },
    out: {
      name: 'ZoomIn',
      from: 2,
      to: 0.8,
      dura: 100
    }
  }, {
    id: 'scene-2',
    type: 'center-focus-text',
    value: 'While the wind',
    out: {
      name: ''
    },
    complete: {
      hide: false
    }
  }]
}
