export default class Transition {
  constructor (engine, opts) {
    this.engine = engine
    if (opts.from != null) {
      this.from = engine.getSceneInstanceByIndex(opts.from)
    }
    if (opts.to != null) {
      this.to = engine.getSceneInstanceByIndex(opts.to)
    }
  }

  active () {
    if (this.to) {
      this.to.enter()
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
}
