export default class Engine {
  constructor () {
    this.activeInstances = []
    this.ticks = []
    this.raf = 0
  }

  step (t) {
    const tickLength = this.ticks.length
    if (tickLength) {
      let i = 0
      let remains = []
      while (i < tickLength) {
        if (this.ticks[i].mill < t) {
          this.ticks[i].tick(t)
        } else {
          remains.push(this.ticks[i])
        }
        i++
      }
      this.ticks = remains
      this.play()
    } else {
      cancelAnimationFrame(this.raf)
      this.raf = 0
    }
  }

  addTick (tick, delay) {
    this.ticks.push({
      tick,
      mill: new Date().getTime() + delay
    })
    if (this.raf === 0) {
      this.play()
    }
  }

  play () {
    this.raf = requestAnimationFrame(this.step.bind(this))
  }
}
