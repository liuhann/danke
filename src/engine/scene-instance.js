export default class SceneInstance {
  constructor (engine, scene) {
    this.engine = engine
    this.scene = scene
  }

  tryStart () {
    if (this.scene.state === 'enter') {
      this.scene.active = this.scene.transition.enter.animation
      if (this.scene.auto) {
        this.engine.addTick((t) => {
          this.autoLeave()
        }, this.scene.auto)
      }
    }
  }

  onLeave (callback) {
    this.onLeaveCallback = callback
  }

  autoLeave () {
    this.scene.state = 'leave'
    this.scene.active = this.scene.transition.leave.animation

    // just emit on leave to callback
    this.onLeaveCallback(this.scene)
    this.engine.addTick((t) => {
      this.scene.state = 'in-active'
      this.scene.active = ''
    }, this.scene.transition.leave.duration)
  }
}
