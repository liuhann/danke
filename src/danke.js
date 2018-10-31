import nanobus from 'nanobus'
import ImagePreloader from 'image-preloader'

import CenterText from './templates/CenterText'
import FullPicture from './templates/FullPicture'
import DesignedScene from './templates/DesignedScene'

import './style/animate.css'

import Ticker from './engine/Ticker'
import Scene from './engine/Scene'
import Transition from './engine/Transition'
import Ground from './engine/Ground'

/**
 * Loading scenes and  resources then init ticker + views
 */
export default class Danke {
  constructor (mount, config, effects) {
    this.mount = mount
    this.data = config
    this.ticker = new Ticker()
    this.nanobus = nanobus()
    this.effects = Object.assign({}, effects, this.data.effects)
  }

  async boot () {
    await this.loadResources()
    this.initDeviceInfo()
    // vue
    await this.loadVue()
    //
    this.loadScenes()
    this.loadTransition()
    this.begin()
  }

  /**
   * Load transitions with null start and trigger them
   */
  begin () {
    this.activeTransitions = this.getTransitionsByFrom(null)
    for (let transition of this.activeTransitions) {
      transition.trigger()
    }
  }

  async loadVue () {
    const { default: Vue } = await import('vue')
    const { default: Slider } = await import('./vue/Slider.vue')

    Vue.config.productionTip = false
    Object.assign(Vue.prototype, {
      ticker: this.ticker,
      nanobus: this.nanobus,
      engine: this,
      gridWidth: this.grid.width,
      gridHeight: this.grid.height
    })
    Vue.component('scene-center-text', CenterText)
    Vue.component('scene-full-picture', FullPicture)
    Vue.component('scene-designed', DesignedScene)
    this.vm = new Vue(Slider).$mount(this.mount)
    this.vm.config = this.data
    this.vm.setScenes(this.data.scenes || [])
    this.vm.setResources(this.data.resources)
    // this.vm.setGrounds(this.data.grounds || [])
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
      this.vm.scenes[i].mount = false
      const sceneInstance = new Scene(this, this.vm.scenes[i])
      this.sceneInstances.push(sceneInstance)
    }
  }

  loadGrounds () {
    this.groundInstances = []
    for (var i = 0; i < this.vm.grounds.length; i++) {
      this.groundInstances[this.vm.grounds[i].key] = new Ground(this, this.vm.grounds[i])
    }
  }

  getBackgroundById (id) {

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

  async loadResources () {
    const preloader = new ImagePreloader()

    for (let resource of this.data.resources) {
      if (resource.type === 'image') {
        await preloader.preload(resource.url)
      }
    }
  }

  initDeviceInfo () {
    this.device = {
      screenWidth: window.outerWidth,
      screenHeight: window.outerHeight
    }
    this.data.grid = this.data.grid || {}
    this.grid = {
      width: this.device.screenWidth / (this.data.grid.x || 10),
      height: this.device.screenHeight / (this.data.grid.y || 20)
    }
  }
}
