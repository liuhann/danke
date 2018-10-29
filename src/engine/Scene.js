export default class Scene {
  constructor (engine, scene) {
    this.engine = engine
    this.scene = scene
  }
  leave (effect) {
    if (effect.leave.duration) {
      this.scene.state = 'leave'
      this.scene.active = {
        animation: effect.leave.animation,
        duration: effect.leave.duration
      }
      // tick to set state
      this.engine.ticker.addTick((t) => {
        this.scene.state = 'in-active'
        this.scene.active = {}
      }, effect.leave.duration)
    } else {
      this.scene.state = 'in-active'
      this.scene.active = {}
    }
    this.engine.nanobus.emit('scene-leave-' + this.scene.index, {
      dura: effect.leave.duration
    })
  }

  enter (effect) {
    if (effect.enter.duration) {
      this.scene.state = 'enter'
      this.scene.active = {
        animation: effect.enter.animation,
        duration: effect.enter.duration
      }
      this.engine.ticker.addTick((t) => {
        this.scene.state = 'on'
        this.scene.active = {}
      }, effect.enter.duration)
    } else {
      this.scene.state = 'on'
      this.scene.active = {}
    }

    this.engine.nanobus.emit('scene-enter-' + this.scene.index, {
      dura: effect.enter.duration
    })

    const targetTransitions = this.engine.getTransitionsByFrom(this.scene)
    for (let transition of targetTransitions) {
      transition.active()
    }
  }
}
