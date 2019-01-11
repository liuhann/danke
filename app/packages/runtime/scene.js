import pauseable from 'pauseable'
export default class Scene {
  constructor (engine, scene) {
    this.engine = engine
    this.scene = scene
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
    this.engine.nanobus.emit('scene-enter', {
      scene: this.scene
    })
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
}
