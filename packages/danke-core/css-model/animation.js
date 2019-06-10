export default {
  name: '',
  desc: '',
  duration: 800,
  timing: 'linear',
  delay: 0,
  iteration: 1,
  infinite: false,
  direction: 'normal',
  fillMode: 'both'
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
