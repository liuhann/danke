import { getElementInnerStyle, getElementStyle, getSceneStyle } from '../danke-core/utils/styles'
/**
 * Loading scenes and  resources then init ticker + views
 */
export default class TickDanke {
  /**
   * @param work 播放配置文件
   * @param device 设备信息  主要是宽度及高度
   */
  constructor (work, device) {
    this.work = work
    this.device = device
    this.scenes = work.scenes
    this.index = -1
    this.ticks = []
    this.initSceneStyleAttr()
  }

  nextScene () {
    if (this.hasNext()) {
      if (this.index >= 0) {
        this.renderLeave(this.scenes[this.index])
      }
      this.index++
      this.ticks.push(this.audio.currentTime)
      this.renderEnter(this.scenes[this.index])
    }
  }

  async play () {
    if (this.work.audioUrl) {
      this.audio = new Audio('http://image.danke.fun/' + this.work.audioUrl)
      const playPromise = this.audio.play()
      if (playPromise !== undefined) {
        await playPromise
      }
      this.nextScene()
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

  renderEnter (scene) {
    // 处理每个元素的入场动画
    for (let element of scene.elements) {
      element.style = getElementStyle(element, this.device, 'in')
      element.innerStyle = getElementInnerStyle(element, this.device)
      if (element.animation.dura.name && element.animation.dura.duration) {
        setTimeout(() => {
          element.style = getElementStyle(element, this.device, 'dura')
        }, element.animation.in.duration + element.animation.in.delay)
      }
    }
    scene.style = `display: inherit; ${getSceneStyle(scene, this.device)}`
  }
  renderLeave (scene) {
    for (let element of scene.elements) {
      element.style = getElementStyle(element, this.device, 'out')
    }
    scene.style = `display: inherit; ${getSceneStyle(scene, this.device, 'out')}`
  }
}
