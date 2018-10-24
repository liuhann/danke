import nanobus from 'nanobus'

import CenterText from './templates/CenterText'
import FullPicture from './templates/FullPicture'
import DesignedScene from './templates/DesignedScene'

import './style/animate.css'

import Ticker from './engine/Ticker'
import SceneInstance from './engine/SceneInstance'
import Transition from './engine/Transition'

/**
 * Loading scenes and  resources then init ticker + views
 */
export default class Danke {
  constructor (mount, config) {
    this.mount = mount
    this.data = config
    this.ticker = new Ticker()
    this.nanobus = nanobus()
    this.effects = this.data.effects
  }

  async boot () {
    // vue
    await this.loadVue()
    //
    this.loadScenes()
    this.loadTransition()
    this.begin()
  }

  begin () {
    this.activeTransitions = this.getTransitionsByFrom(null)
    for (let transition of this.activeTransitions) {
      transition.trigger()
    }
  }

  async loadVue () {
    const { default: Vue } = await import('vue')
    const { default: Slider } = await import('./vue/Slider.vue')

    Vue.prototype.ticker = this
    Vue.config.productionTip = false
    Object.assign(Vue.prototype, {
      danke: this
    })
    Vue.component('scene-center-text', CenterText)
    Vue.component('scene-full-picture', FullPicture)
    Vue.component('scene-designed', DesignedScene)
    this.vm = new Vue(Slider).$mount(this.mount)
    this.vm.config = this.data
    this.vm.setScenes(this.data.scenes)
  }

  loadTransition () {
    this.transitionInstances = []
    for (let transitionConfig of this.data.transitions) {
      const transitionInstance = new Transition(this, transitionConfig)
      this.transitionInstances.push(transitionInstance)
    }
  }

  loadScenes () {
    this.sceneInstances = []
    for (var i = 0; i < this.vm.scenes.length; i++) {
      this.vm.scenes[i].index = i
      const sceneInstance = new SceneInstance(this, this.vm.scenes[i])
      this.sceneInstances.push(sceneInstance)
    }
  }

  getSceneInstanceByIndex (index) {
    return this.sceneInstances[index]
  }

  getTransitionsByFrom (from) {
    const transitions = []
    for (let transition of this.transitionInstances) {
      if (transition.isFrom(from)) {
        transitions.push(transition)
      }
    }
    return transitions
  }

  emit (event) {
    const transitions = this.getTransitionsByFrom(event.index)
    for (let transition of transitions) {
      transition.on(event)
    }
  }
}
