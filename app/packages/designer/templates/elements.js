import util from '../../utils/util'

const BACKGROUND = {
  mode: '1',
  color: '#fff',
  gradients: ['#fff', '#fff'],
  angle: 'to bottom',
  size: 'cover',
  position: 'center center',
  image: '',
  repeat: 'no-repeat',
  blend: 'multiply'
}

const FONT = {
  size: 16,
  spacing: 2,
  color: '#fff',
  weight: 'normal',
  align: 'left',
  decoration: 'none',
  style: 'normal'
}

const TURNING = {
  type: 'auto',
  delay: 3000
}

const BASE = {
  version: '1.2',
  type: '',
  position: {
    horizontal: 'left',
    vertical: 'top',
    offsetX: '5vw',
    offsetY: '3vh',
    width: '90vw',
    height: '90vh'
  },
  background: BACKGROUND,
  border: {
    width: 0,
    style: 'solid',
    color: '#fff',
    sides: ['left', 'right', 'top', 'bottom'],
    radius: [0, 0, 0, 0]
  },
  font: FONT,
  in: {
    animation: '',
    duration: 400,
    delay: 0,
    timing: 'easeInCubic',
    repeat: '1'
  },
  out: {
    animation: '',
    duration: 400,
    delay: 0,
    timing: 'easeInCubic',
    repeat: '1'
  },
  existence: {
    animation: '',
    duration: 400,
    timing: 'easeInCubic',
    repeat: 'infinite'
  }
}

const IMAGE = util.mergeDeep({}, BASE, {
  type: 'image',
  sizing: 'cover',
  background: {
    color: '#efefef'
  },
  position: {
    align: 'center',
    offsetX: '5vw',
    offsetY: '3vh',
    width: '90vw',
    height: '60vw'
  }
})

const TEXT = util.mergeDeep({}, BASE, {
  type: 'text',
  content: '请输入文字',
  font: {
    size: 16,
    color: '#000'
  },
  background: {
    mode: '0'
  },
  position: {
    align: 'left',
    offsetX: '5vw',
    offsetY: '3vh',
    width: '90vw',
    height: '6vw'
  }
})
const CIRCLE = util.mergeDeep({}, BASE, {
  type: 'circle',
  radius: '20vw'
})

const WORK = util.mergeDeep({}, {
  turning: TURNING,
  font: FONT,
  scenes: []
})

const SCENE = util.mergeDeep({}, {
  type: 'slide',
  play: 'auto',
  background: BACKGROUND,
  hideDelay: 2000,
  duration: 3000,
  elements: []
}, {
  background: {
    color: 'transparent'
  }
})

export default {
  SCENE,
  WORK,
  BACKGROUND,
  FONT,
  TURNING,
  IMAGE,
  TEXT,
  CIRCLE
}
