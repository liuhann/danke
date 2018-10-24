export default class SceneInstance {
  constructor (danke, scene) {
    this.danke = danke
    this.ticker = danke.ticker
    this.scene = scene
  }
  leave (effect) {
    this.scene.state = 'leave'
    this.scene.active = {
      animation: effect.leave.animation,
      duration: effect.leave.duration
    }
    // tick to set state
    this.ticker.addTick((t) => {
      this.scene.state = 'in-active'
      this.scene.active = {}
    }, effect.leave.duration)
    this.danke.nanobus.emit('scene-leave-' + this.scene.index, {
      dura: effect.leave.duration
    })
  }

  enter (effect) {
    this.scene.state = 'enter'
    this.scene.active = {
      animation: effect.enter.animation,
      duration: effect.enter.duration
    }
    this.ticker.addTick((t) => {
      this.scene.state = 'on'
      this.scene.active = {}
    }, effect.enter.duration)

    this.danke.nanobus.emit('scene-enter-' + this.scene.index, {
      dura: effect.enter.duration
    })

    const targetTransitions = this.danke.getTransitionsByFrom(this.scene)
    for (let transition of targetTransitions) {
      transition.active()
    }
  }
}
