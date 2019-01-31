import pauseable from 'pauseable'
import utils from '../utils/util'
import styleUtils from '../utils/styles'

export default class Scene {
  constructor (engine, scene, device) {
    this.engine = engine
    this.scene = scene
    this.device = device
    this.id = scene.id || utils.shortid()
    this.beforeRender()
  }

  leave () {
    this.renderLeave()
    this.engine.sceneLeaveCallback(this)
    pauseable.setTimeout(() => {
      this.renderHide()
      this.engine.sceneHideCallback(this)
    }, this.scene.hideDelay || 3000)
  }

  enter () {
    this.renderEnter()
    if (this.scene.duration) {
      this.pauseForLeave = pauseable.setTimeout(this.engine.next.bind(this.engine), this.scene.duration)
    }
  }

  // 首先初始化数据，之后的变化vue绑定才能探知
  beforeRender () {
    this.scene.display = 'none'
    this.scene.style = ''
    for (let element of this.scene.elements) {
      element.style = ''
    }
  }

  renderEnter () {
    // 处理每个元素的入场动画
    for (let element of this.scene.elements) {
      element.style = styleUtils.getElementStyle(element, this.device, 'in')
    }
    this.scene.style = styleUtils.getSceneStyle(this.scene, this.device)
    this.scene.display = 'visible'
  }

  renderLeave () {
    for (let element of this.scene.elements) {
      element.style = styleUtils.getElementStyle(element, this.device, 'out')
    }
  }

  renderHide () {
    this.scene.display = 'none'
  }
}
