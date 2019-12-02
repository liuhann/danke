export default {
  name: '',
  desc: '',
  duration: 800,
  timing: 'linear',
  delay: 0,
  iteration: 1,
  infinite: false,
  srcFrame: '',
  frames: [],
  overflow: true,
  fillMode: 'both'
}
export function trim (element) {
  for (let key in element.animation) {
    const ani = element.animation[key]
    if (ani.name === '' || ani.duration === 0) {
      delete element.animation[key]
    }
  }
}
export function getMaxDuration (elements, type) {
  let max = 0
  for (let element of elements) {
    if (element.animation[type]) {
      if (element.animation[type].delay + element.animation[type].duration > max) {
        max = element.animation[type].delay + element.animation[type].duration
      }
    }
  }
  return max
}
