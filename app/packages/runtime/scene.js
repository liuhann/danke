import pauseable from 'pauseable'
import utils from '../utils/util'
import styleUtils from '../utils/styles'

export default class Scene {
  constructor (engine, scene, device) {
    this.engine = engine
    this.scene = scene
    this.device = device
    this.id = scene.id || utils.shortid()
  }

  leave () {
    const hideDelay = this.scene.hideDelay || 1000

    this.engine.nanobus.emit('scene-leaving', {
      scene: this.scene,
      duration: hideDelay
    })

    setTimeout(() => {
      this.engine.nanobus.emit('scene-hide', {
        scene: this.scene
      })
    }, hideDelay)
  }

  enter () {
    this.renderEnter()
    if (this.scene.triggerClose) {
      pauseable.setTimeout()
      setTimeout(() => {
        const targetTransitions = this.engine.getTransitionsByFrom(this.scene)
        if (targetTransitions.length === 0) {
          this.engine.nanobus.emit('play-end')
        } else {
          this.leave()
          for (let transition of targetTransitions) {
            transition.active()
          }
        }
      }, this.scene.triggerClose)
    }
  }

  renderEnter () {
    // 处理每个元素的动画
    for (let element of this.scene.elements) {
      element.style = styleUtils.getElementStyle(element, this.device, 'in')
    }
    this.scene.display = 'visible'
  }
}
