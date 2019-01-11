import util from '../utils/util'

const BACKGROUND = {
  mode: '1',
  color: '#fff',
  gradients: ['#fff', '#fff'],
  angle: 'to bottom',
  image: '',
  blend: 'multiply'
}

const FONT = {
  size: 16,
  spacing: 2,
  color: '#fff',
  weight: 'normal',
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
    repeat: 1
  },
  out: {
    animation: '',
    duration: 400,
    delay: 0,
    timing: 'easeInCubic',
    repeat: 1
  },
  existence: {
    animation: '',
    duration: 400,
    timing: 'easeInCubic',
    repeat: -1
  }
}

const IMAGE = util.mergeDeep({}, BASE, {
  type: 'image',
  sizing: 'cover',
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
    size: 14,
    color: '#000'
  }
})
const CIRCLE = util.mergeDeep({}, BASE, {
  type: 'circle',
  radius: '20vw'
})

const WORK = util.mergeDeep({}, {
  turning: TURNING,
  font: FONT,
  background: BACKGROUND,
  scenes: []
})

export default {
  WORK,
  BACKGROUND,
  FONT,
  TURNING,
  IMAGE,
  TEXT,
  CIRCLE
}
