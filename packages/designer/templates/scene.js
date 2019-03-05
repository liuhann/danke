import BACKGROUND from './background'

export default {
  type: 'slide',
  play: 'auto',
  title: '',
  background: Object.assign({}, BACKGROUND, {
    mode: '0'
  }),
  hideDelay: 2000,
  duration: 5000,
  elements: []
}
