import BACKGROUND from '../css-model/background'
import ANIMATION from '../css-model/animation'
export const sceneTypeEnum = {
  COMMON: 1,
  BACKGROUND: 2,
  FORGROUND: 3
}
export const sceneType = [{
  key: sceneTypeEnum.COMMON,
  value: '普通'
}, {
  key: sceneTypeEnum.BACKGROUND,
  value: '背景'
}, {
  key: sceneTypeEnum.FORGROUND,
  value: '前景'
}]
export default {
  name: '',
  type: 1,
  background: BACKGROUND,
  elements: [],
  leave: 3000,
  manual: false,
  animation: {
    in: ANIMATION,
    dura: ANIMATION,
    out: ANIMATION
  }
}
