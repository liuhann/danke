export default {
  name: '', // 动画名称
  desc: '', // 名称便于阅读
  duration: 800,  // 持续时间
  stage: 'in',  // 对应阶段
  timing: 'linear',
  delay: 0, // 相对阶段时间的延迟
  iteration: 1, // 重复次数
  infinite: false, // 无限次重复的标志
  overflow: true, // 动画效果是否相对原本位置溢出
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
