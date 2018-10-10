export default class Engine {
  constructor () {
    this.ticks = []
    this.raf = 0
  }

  step (t) {
    const ticks = this.ticks
    this.ticks = []
    const tickLength = ticks.length
    if (tickLength) {
      let i = 0
      const now = new Date().getTime()
      while (i < tickLength) {
        // run ticks without mill or mill passed
        if (!ticks[i].mill || ticks[i].mill < now) {
          ticks[i].tick(t)
        } else {
          this.ticks.push(ticks[i])
        }
        i++
      }
      this.play()
    } else {
      cancelAnimationFrame(this.raf)
      this.raf = 0
    }
  }

  addTick (tf, delay) {
    const tick = {
      tick: tf
    }
    if (delay) {
      tick.mill = new Date().getTime() + delay
    }
    this.ticks.push(tick)
    if (this.raf === 0) {
      this.play()
    }
  }

  play () {
    this.raf = requestAnimationFrame(this.step.bind(this))
  }
}
