export default class Transition {
  constructor (engine, opts) {
    this.engine = engine
    this.ticker = engine.ticker
    if (opts.from != null) {
      this.from = engine.getSceneInstanceByIndex(opts.from)
    }
    if (opts.to != null) {
      this.to = engine.getSceneInstanceByIndex(opts.to)
    }
    this.triggerOpt = opts.trigger
    this.effect = opts.effect
  }

  on (event) {
    if (event.name === this.triggerOpt.event) {
      this.trigger()
    }
  }

  active () {
    // handle on auto trigger
    if (this.triggerOpt.delay) {
      this.ticker.addTick((t) => {
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
      this.from.leave(this.engine.effects[this.effect])
    }
    if (this.to) {
      this.to.enter(this.engine.effects[this.effect])
    }
  }
}
