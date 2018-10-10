export default class Transition {
  constructor (danke, opts) {
    this.danke = danke
    this.engine = danke.engine
    if (opts.from != null) {
      this.from = danke.getSceneInstanceByIndex(opts.from)
    }
    if (opts.to != null) {
      this.to = danke.getSceneInstanceByIndex(opts.to)
    }
    this.triggerOpt = opts.trigger
    this.effect = opts.effect
  }

  on (event) {
    if (event.name === this.triggerOpt.event && this.isFrom(event.from)) {
      this.trigger()
    }
  }

  active () {
    if (this.triggerOpt.delay) {
      this.engine.addTick((t) => {
        this.trigger()
      }, this.triggerOpt.delay)
    }
  }

  /**
   * Test if transition is from f. return true if f==null and this.from==null
   * @param f
   * @returns {boolean}
   */
  isFrom (f) {
    if (f == null && this.from == null) {
      return true
    }
    if (this.from && f) {
      if (this.from.scene.index === f || this.from.scene.index === f.index) {
        return true
      }
    }
    return false
  }

  trigger () {
    if (this.from) {
      this.from.leave(this.danke.effects[this.effect])
    }
    if (this.to) {
      this.to.enter(this.danke.effects[this.effect])
    }
  }
}
