import { getElementInnerStyle, getElementStyle, getSceneStyle, getAnimationStyle } from './utils/styles'
/**
 * Loading scenes and  resources then init ticker + views
 */
export default class AudioDanke {
  /**
   * @param work 播放配置文件
   * @param device 设备信息  主要是宽度及高度
   */
  constructor (work, device, audio) {
    this.device = device
    this.ticks = work.audioTicks
    this.scenes = work.scenes
    this.index = 0
    this.audio = audio
    this.initSceneStyleAttr()
  }
  setDevice (device) {
    this.device = device
  }

  play (audio) {
    this.inteval = setInterval(() => {
      if (this.audio.currentTime > this.ticks[this.index]) {
        if (this.scenes[this.index]) {
          this.renderLeave(this.scenes[this.index])
        }
        this.index++
        if (this.scenes[this.index]) {
          this.renderEnter(this.scenes[this.index])
        }
        console.log(this.index, this.ticks[this.index - 1], this.audio.currentTime)
      }
    }, 10)
    if (this.scenes[this.index]) {
      this.renderEnter(this.scenes[this.index])
    }
  }
  hasNext () {
    return this.scenes.length - 1 > this.index
  }
  initSceneStyleAttr () {
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i]
      scene.style = `display: none`
      if (scene.elements) {
        for (let element of scene.elements) {
          element.style = ''
        }
      }
      scene.index = i
    }
  }

  enterScene () {
    if (this.index > 0) {
      this.renderLeave()
    }
    const scene = this.scenes[this.index]
    if (scene) {
      this.renderEnter(scene)
    }
  }

  renderEnter (scene) {
    // 处理每个元素的入场动画
    for (let element of scene.elements) {
      element.style = getElementStyle(element, this.device, 'in')
      element.innerStyle = getElementInnerStyle(element, this.device) + ';' + getAnimationStyle(element, 'in')
      if (element.animation.dura.name && element.animation.dura.duration) {
        setTimeout(() => {
          element.style = getElementStyle(element, this.device, 'dura')
          element.innerStyle = getElementInnerStyle(element, this.device) + ';' + getAnimationStyle(element, 'dura')
        }, element.animation.in.duration + element.animation.in.delay)
      }
    }
    scene.style = `display: inherit; ${getSceneStyle(scene, this.device)}`
  }

  leaveScene (scene) {
    this.renderLeave(scene)
  }

  renderLeave (scene) {
    for (let element of scene.elements) {
      element.style = getElementStyle(element, this.device, 'out')
      element.innerStyle = getElementInnerStyle(element, this.device) + ';' + getAnimationStyle(element, 'out')
    }
    scene.style = `display: inherit; ${getSceneStyle(scene, this.device, 'out')}`
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
}
