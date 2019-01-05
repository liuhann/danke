import util from '../utils/util'
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
  background: {
    mode: '1',
    color: '#fff',
    gradients: ['#fff', '#fff'],
    angle: 'to bottom'
  },
  border: {
    width: 0,
    style: 'solid',
    color: '#fff',
    sides: ['left', 'right', 'top', 'bottom'],
    radius: [0, 0, 0, 0]
  },
  font: {
    size: 16,
    lspace: 2,
    color: '#fff',
    weight: 'normal',
    decoration: 'none',
    style: 'normal'
  },
  in: {
    animation: '',
    duration: 400,
    delay: 0,
    timing: 'easeInCubic'
  },
  out: {
    animation: '',
    duration: 400,
    delay: 0,
    timing: 'easeInCubic'
  },
  existence: {
    animation: '',
    duration: 400,
    timing: 'easeInCubic'
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
    size: '14px',
    color: '#fff'
  }
})
const CIRCLE = util.mergeDeep({}, BASE, {
  type: 'circle',
  radius: '20vw'
})

export default {
  IMAGE,
  TEXT,
  CIRCLE
}
