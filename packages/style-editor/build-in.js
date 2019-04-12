const devices = [{
  device: 'iPhone XS Max',
  vp: [414, 896]
}, {
  device: 'Galaxy S9+',
  vp: [360, 740]
}, {
  device: 'Watch',
  vp: [227, 227]
}, {
  device: 'iPad Pro',
  vp: [768, 1024]
}, {
  device: 'MacBook',
  vp: [1440, 900]
}, {
  device: 'Camera Ratio 3x2',
  vp: [600, 400]
}, {
  device: 'Splash slide 16x9',
  vp: [960, 540]
}]

const animations = [{
  name: 'slideIn',
  frames: [{
    percent: 0,
    translate: ['100%', '0px', '0px']
  }, {
    percent: 100,
    translate: ['0px', '0px', '0px']
  }]
}, {
  name: 'flipIn',
  frames: [{
    percent: 0,
    rotate: ['80deg', '0deg', '0deg'],
    opacity: 0
  }, {
    percent: 100,
    rotate: ['0deg', '0deg', '0deg'],
    opacity: 1
  }]
}]

export {
  devices,
  animations
}
