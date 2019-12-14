import BACKGROUND from '../css-model/background'
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
const background = JSON.parse(JSON.stringify(BACKGROUND))
background.color = ['rgba(0,0,0,0)']
export default {
  name: '',
  type: 1,
  ratio: '',
  background,
  elements: [],
  res: {},
  leave: 3000,
  hideAfterDelay: 3000,
  className: '',
  script: '',
  z: 100, // 场景的层次
  manual: false,
  animations: []
}
