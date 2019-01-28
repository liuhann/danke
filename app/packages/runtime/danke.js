import Scene from './scene'
import Transition from './transition'
import styleUtils from '../utils/styles'

import is from '../utils/is'

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
    this.work.style = styleUtils.getWorkStyle(this.work, device)
    this.device = device
    this.scenes = []
    this.transitions = []

    this.loadScenesAndTransition()
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
    for (let i = 0; i < this.work.scenes.length; i++) {
      const def = this.work.scenes[i]
      def.index = i
      this.scenes.push(new Scene(this, def, this.device))
    }

    for (let transition of this.work.transitions) {
      this.transitions.push(new Transition(this, transition))
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

  getScene (key) {
    if (Number.isInteger(key)) {
      return this.scenes[key]
    } else if (is.str(key)) {
      for (let scene of this.scenes) {
        if (scene.id === key) {
          return scene
        }
      }
    }
  }

  getTransitionsByFrom (from) {
    const transitions = []
    for (let transition of this.transitions) {
      if (transition.isFrom(from)) {
        transitions.push(transition)
      }
    }
    return transitions
  }
}
