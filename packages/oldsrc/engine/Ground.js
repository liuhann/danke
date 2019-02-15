export default class Ground {
  constructor (engine, ground) {
    this.engine = engine
    this.ground = ground
  }

  enter (effect) {
    if (this.ground.state === 'on') {
      return
    }
    this.ground.state = 'enter'
    this.ground.active = {
      animation: effect.enter.animation,
      duration: effect.enter.duration
    }
    this.engine.ticker.addTick((t) => {
      this.ground.state = 'on'
      this.ground.active = {}
    }, effect.enter.duration)
  }

  leave (effect) {
    this.ground.state = 'leave'
    this.ground.active = {
      animation: effect.leave.animation,
      duration: effect.leave.duration
    }
    // tick to set state
    this.engine.ticker.addTick((t) => {
      this.ground.state = 'in-active'
      this.ground.active = {}
    }, effect.leave.duration)
  }
}
