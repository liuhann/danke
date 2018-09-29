export default {
  theme: {
    background: {
      type: 'image',
      url: 'img/bg.png'
    }
  },
  scenes: {
    start: {
      stages: [{
        type: 'text',
        value: 'Hello Kitty',
        bottom: '15%',
        animation: 'slideUp',
        delay: '200'
      }, {
        type: 'image',
        url: 'img/cover.png',
        animation: 'fadeIn',
        duration: '300'
      }]
    }
  }
}
