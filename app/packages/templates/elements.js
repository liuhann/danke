const BASE = {
  version: '1.2',
  type: '',
  position: {
    vertical: 'top',
    align: 'left',
    verticalMagin: '',
    right: '',
    width: '',
    height: ''
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
  existence: {
    animation: ''
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

const IMAGE = Object.assign({}, BASE, {
  type: 'image',
  sizing: 'cover',
  position: {
    align: 'center',
    top: '5vw',
    width: '90vw',
    height: '60vw'
  }
})
const TEXT = Object.assign({}, BASE, {
  type: 'text',
  content: '请输入文字',
  font: {
    size: '14px',
    color: '#fff'
  }
})
const CIRCLE = Object.assign({}, BASE, {
  type: 'circle',
  radius: '20vw'
})

export default {
  IMAGE,
  TEXT,
  CIRCLE
}
