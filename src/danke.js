import CenterText from './templates/CenterText'
import FullPicture from './templates/FullPicture'

import './style/animate.css'

import Engine from './engine/Engine'
import SceneInstance from './engine/SceneInstance'
import Transition from './engine/Transition'

/**
 * Loading scenes and  resources then init engine + views
 */
export default class Danke {
  constructor (mount, config) {
    this.mount = mount
    this.data = config
    this.engine = new Engine()
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

    Vue.prototype.engine = this
    Vue.config.productionTip = false
    Vue.component('scene-center-text', CenterText)
    Vue.component('full-picture', FullPicture)
    this.vm = new Vue(Slider).$mount(this.mount)
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
    console.log(event)
  }
}
