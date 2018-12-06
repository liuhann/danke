import nanobus from './nanobus'
import Ticker from './Ticker'
import Scene from './scene'
import Transition from './transition'
import utils from './util'
/**
 * Loading scenes and  resources then init ticker + views
 */
export default class Danke {
  /**
   * @param config 播放配置文件
   * @param device 设备信息  主要是宽度及高度
   */
  constructor (config, device) {
    this.config = config
    this.device = device
    this.ticker = new Ticker()
    this.loadScenesAndTransition()
    this.initNanobusEvents()
  }

  setDevice (device) {
    this.device = device
  }
  /**
   * Load transitions with null start and trigger them
   */
  begin () {
    this.activeTransitions = this.getTransitionsByFrom(null)
    for (let transition of this.activeTransitions) {
      transition.active()
    }
  }

  loadScenesAndTransition () {
    this.sceneInstances = []
    for (var i = 0; i < this.config.scenes.length; i++) {
      this.config.scenes[i].index = i
      this.config.scenes[i].display = 'none'
      const sceneInstance = new Scene(this, this.config.scenes[i])
      this.sceneInstances.push(sceneInstance)
    }
    this.transitionInstances = []
    for (let transitionConfig of this.config.transitions) {
      const transitionInstance = new Transition(this, transitionConfig)
      this.transitionInstances.push(transitionInstance)
    }
  }

  sceneEnter (cb) {
    this.sceneEnterCallback = cb
  }

  sceneLeave (cb) {
    this.sceneLeaveCallback = cb
  }

  sceneHide (cb) {
    this.sceneHideCallback = cb
  }

  playEnd (cb) {
    this.playEndCallback = cb
  }

  initNanobusEvents () {
    this.nanobus = nanobus()
    this.nanobus.addListener('scene-enter', ({ scene }) => {
      // 处理每个元素的动画
      for (let ei = 0; ei < scene.elements.length; ei++) {
        let element = scene.elements[ei]
        const elementStyle = utils.getElementStyle(element, this.device, this.config.coordinate, 'in')
        element.elementStyle = elementStyle.join(';')
        if (element.in) {
          if (element.in.animation) {
            element.animation = element.in.animation
          }
        }
      }
      scene.display = 'visible'
      if (this.sceneEnterCallback) {
        this.sceneEnterCallback(scene)
      }
    })

    this.nanobus.addListener('scene-leaving', ({ scene }) => {
      // 处理每个元素的动画
      for (let ei = 0; ei < scene.elements.length; ei++) {
        let element = scene.elements[ei]
        const elementStyle = utils.getElementStyle(element, this.device, this.config.coordinate, 'out')
        element.elementStyle = elementStyle.join(';')
        if (element.out && element.out.animation) {
          element.animation = element.out.animation
        } else {
          element.animation = ''
        }
      }
      scene.display = 'visible'
      // console.log('scene-leaving  set data', data)
      if (this.sceneLeaveCallback) {
        this.sceneLeaveCallback(scene)
      }
    })

    this.nanobus.addListener('scene-hide', ({ scene }) => {
      scene.display = 'none'
      if (this.sceneHideCallback) {
        this.sceneHideCallback(scene)
      }
    })

    this.nanobus.addListener('play-end', () => {
      if (this.playEndCallback) {
        this.playEndCallback()
      }
    })
  }

  listen () {
    // 触发点击离开scene事件
    this.nanobus.addEventListener('scene-handy-leave', (event) => {
      for (let transition of this.transitionInstances) {
        if (transition.from && transition.from.index === event.index) {
          transition.trigger()
        }
      }
    })
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
}
