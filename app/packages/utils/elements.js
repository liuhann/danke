const BASE = {
  type: '',
  x: '5vw',
  y: '3vh',
  width: '90vw',
  height: '39vh',
  animationPreview: {},
  background: {},
  border: {},
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

const IMAGE = Object.assign(BASE, {
  type: 'image',
  clipPath: '',
  sizing: 'cover'
})
const TEXT = Object.assign(BASE, {
  type: 'text',
  font: {
    size: '14px',
    color: '#fff'
  }
})
const CIRCLE = Object.assign(BASE, {
  type: 'circle',
  radius: '20vw'
})

export default {
  IMAGE,
  TEXT
}
