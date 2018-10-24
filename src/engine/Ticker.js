export default class Ticker {
  constructor () {
    this.ticks = []
    this.raf = 0
    this.pausedTime = 0
    this.pausedTicks = []
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

  pause () {
    this.pausedTime = new Date().getTime()
    if (this.ticks.length) {
      this.pausedTicks = this.ticks
      this.ticks = []
    }
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
  }

  resume () {
    const resumeNow = new Date().getTime()
    if (this.pausedTicks.length) {
      for (let tick of this.pausedTicks) {
        if (tick.mill) {
          tick.mill += resumeNow - this.pausedTime
        }
        this.ticks.push(tick)
      }
    }
    this.play()
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
