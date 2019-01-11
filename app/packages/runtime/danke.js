import nanobus from '../utils/nanobus'
import Scene from './scene'
import Transition from './transition'
import styleUtils from '../utils/styles'
/**
 * Loading scenes and  resources then init ticker + views
 */
export default class Danke {
  /**
   * @param work 播放配置文件
   * @param device 设备信息  主要是宽度及高度
   */
  constructor (work, device) {
    this.work = work
    this.device = device
    this.timeout = null
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
    for (var i = 0; i < this.work.scenes.length; i++) {
      this.work.scenes[i].index = i
      this.work.scenes[i].display = 'none'
      const sceneInstance = new Scene(this, this.work.scenes[i])
      this.sceneInstances.push(sceneInstance)
    }
    this.transitionInstances = []
    for (let transitionConfig of this.work.transitions) {
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

  initWorkStyle () {
    this.work.style = styleUtils.getBackgroundStyle(this.work.background)
  }

  initNanobusEvents () {
    this.nanobus = nanobus()
    this.nanobus.addListener('scene-enter', ({ scene }) => {
      // 处理每个元素的动画
      for (let ei = 0; ei < scene.elements.length; ei++) {
        let element = scene.elements[ei]
        const elementStyle = styleUtils.getElementStyle(element, this.device, 'in')
        element.elementStyle = elementStyle.join(';')
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
        const elementStyle = styleUtils.getElementStyle(element, this.device, 'out')
        element.elementStyle = elementStyle.join(';')
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
