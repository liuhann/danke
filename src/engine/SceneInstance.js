export default class SceneInstance {
  constructor (danke, scene) {
    this.danke = danke
    this.engine = danke.engine
    this.scene = scene
  }
  leave (effect) {
    this.scene.state = 'leave'
    this.scene.active = effect.leave.animation
    this.engine.addTick((t) => {
      this.scene.state = 'in-active'
      this.scene.active = ''
    }, effect.leave.duration)
  }

  enter (effect) {
    this.scene.state = 'enter'
    this.scene.active = effect.enter.animation
    this.engine.addTick((t) => {
      this.scene.state = 'on'
      this.scene.active = ''
    }, effect.enter.duration)
    
    const targetTransitions = this.danke.getTransitionsByFrom(this.scene)
    for (let transition of targetTransitions) {
      transition.active()
    }
  }
}
