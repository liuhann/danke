import merge from 'merge'

import CenterText from './templates/CenterText'
import MotionPlugin from './motions/motion'

import Engine from './engine/engine'
import SceneInstance from './engine/scene-instance'

/**
 * Loading scenes and  resources then init engine + views
 */
export default class Danke {
  constructor (mount, config) {
    this.mount = mount
    this.data = config
    this.engine = new Engine()
  }

  async boot () {
    const danke = this
    const { default: Vue } = await import('vue')
    const { default: Slider } = await import('./Slider.vue')
    Vue.config.productionTip = false
    this.prepareTemplate(Vue)
    Vue.prototype.dankeEngine = this.engine

    this.vm = new Vue(Slider).$mount(this.mount)
    this.vm.setScenes(this.parepareScene())

    this.sceneInstances = []
    for (var i = 0; i < this.vm.scenes.length; i++) {
      const sceneInstance = new SceneInstance(this.engine, this.vm.scenes[i])
      sceneInstance.onLeave((scene, next) => {
        if (!next) {
          if (scene.index < danke.vm.scenes.length - 1) {
            danke.vm.scenes[scene.index + 1].state = 'enter'
          }
        }
        danke.sceneInstances.forEach(sceneInstance => {
          sceneInstance.tryStart()
        })
        if (danke.engine.raf === 0) {
          danke.engine.play()
        }
      })
      sceneInstance.tryStart()
      this.sceneInstances.push(sceneInstance)
    }

    if (this.engine.raf === 0) {
      this.engine.play()
    }
  }

  prepareTemplate (Vue) {
    Vue.use(MotionPlugin)
    Vue.component('scene-center-text', CenterText)
  }

  parepareScene () {
    const prepared = []
    for (let i = 0; i < this.data.scenes.length; i++) {
      let merged = merge.recursive(true, {
        transition: this.data.transition,
        state: 'in-active',
        active: '',
        auto: this.data.auto,
        index: i
      }, this.data.scenes[i])
      if (i === 0) {
        merged.state = 'enter'
      }
      prepared.push(merged)
    }
    return prepared
  }
}
