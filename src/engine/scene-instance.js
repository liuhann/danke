import Instance from './instance'

const state = {
  IN_ACTIVE: 'in-active',
  ENTER: 'enter',
  LEAVE: 'leave'
}

export default class SceneInstance extends Instance {
  constructor (engine, scene, allScenes) {
    super()
    this.engine = engine
    this.scene = scene
    this.allScenes = allScenes
    this.engine.addTick((t) => {
      this.tryStart()
    })
  }

  tryStart () {
    if (this.scene.state === state.ENTER) {
      this.scene.active = this.scene.transition[state.ENTER]
      if (this.scene.auto) {
        this.engine.addTick((t) => {
          this.tryLeave()
        }, this.scene.auto)
      }
    }
  }

  tryLeave () {
    this.scene.state = state.LEAVE
    this.scene.active = this.scene.transition.leave.name

    this.engine.addTick((t) => {
      this.scene.state = 'in-active'
    }, this.scene.transition.leave.dura)
  }
}
