export default [{
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
