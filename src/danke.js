import CenterFocusText from './templates/CenterFocusText'
import CenterText from './templates/CenterText'
import MotionPlugin from './motions/motion'
import STATE from './states'

export default class Danke {
  constructor (mount, data, config) {
    this.mount = mount
    this.data = data
    this.config = config
  }

  async boot () {
    const { default: Vue } = await import('vue')
    const { default: Slider } = await import('./Slider.vue')
    Vue.config.productionTip = false

    this.parepare()
    Slider.props.scenes.default = () => this.data.scenes

    Vue.use(MotionPlugin)
    Vue.component('scene-center-focus-text', CenterFocusText)
    Vue.component('scene-center-text', CenterText)
    new Vue({
      render: h => h(Slider)
    }).$mount(this.mount)
  }

  parepare () {
    let hasActive = false
    for (let scene of this.data.scenes) {
      if (!scene.state) {
        scene.state = STATE.IN_ACTIVE
      }
      if (scene.state === STATE.ENTER) {
        hasActive = true
      }
    }
    if (!hasActive && this.data.scenes.length) {
      this.data.scenes[0].state = this.data.scenes[0][STATE.ENTER] || this.data[STATE.ENTER]
    }
  }

  load () {
  }
}
