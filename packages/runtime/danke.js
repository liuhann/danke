import pauseable from 'pauseable'
/**
 * Loading scenes and  resources then init ticker + views
 */
export default class Danke {
  /**
   * @param work 播放配置文件
   * @param device 设备信息  主要是宽度及高度
   */
  constructor (scenes, device) {
    this.device = device
    this.scenes = scenes
    this.displays = {
      current: null,
      fore: null,
      back: null
    }
    this.index = -1
    this.initSceneStyleAttr()
  }

  setDevice (device) {
    this.device = device
  }

  hasNext () {
    return this.scenes.length - 1 > this.index
  }

  /**
   * trigger next display scenes
   */
  next () {
    // 游标向下
    this.index++
    // 判断播放结束
    if (this.index > this.scenes.length - 1) {
      this.playEndCallback && this.playEndCallback(this)
      return
    }
    // 当前场景退出
    if (this.displays.current) {
      this.leaveScene(this.displays.current)
    }
    // 获取下一个显示场景
    this.displays.current = this.scenes[this.index]
    while (this.displays.current.type !== 'slide') {
      this.index++
      this.displays.current = this.scenes[this.index]
    }
    // 检查更新前景和背景
    this.checkForBack()
    this.enterScene(this.displays.current)
  }

  checkForBack () {
    // 获取当前场景需要的背景和前景
    let previousBack = null
    let previousFore = null
    for (let i = this.index; i > -1; i--) {
      if (!previousBack && this.scenes[i].type === 'background') {
        previousBack = this.scenes[i]
      }
      if (!previousFore && this.scenes[i].type === 'foreground') {
        previousFore = this.scenes[i]
      }
      if (previousBack && previousFore) {
        break
      }
    }
    // 如果新背景则启用， 旧的不做任何处理
    if (previousBack && previousBack !== this.displays.back) {
      this.enterScene(previousBack)
      if (this.displays.back) {
        this.leaveScene(this.displays.back)
      }
      this.displays.back = previousBack
    }

    if (previousFore && previousFore !== this.displays.fore) {
      this.enterScene(previousFore)
      if (this.displays.fore) {
        this.leaveScene(this.displays.fore)
      }
      this.displays.fore = previousFore
    }
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

  enterScene (scene) {
    this.renderEnter(scene)
    this.sceneEnterCallback && this.sceneEnterCallback(this)
    if (scene.duration && scene.type === 'slide') {
      this.pauseForLeave = pauseable.setTimeout(this.next.bind(this), scene.duration)
    }
  }

  renderEnter (scene) {
    // 处理每个元素的入场动画
    for (let element of scene.elements) {
      element.style = styleUtils.getElementStyle(element, this.device, 'in')
      if (element.existence.animation && element.existence.duration) {
        pauseable.setTimeout(() => {
          element.style = styleUtils.getElementStyle(element, this.device, 'existence')
        }, element.in.duration + element.in.delay)
      }
    }
    scene.style = `display: inherit; ${styleUtils.getSceneStyle(scene, this.device)}`
  }

  leaveScene (scene) {
    this.renderLeave(scene)
    this.sceneLeaveCallback && this.sceneLeaveCallback(this)
    pauseable.setTimeout(() => {
      scene.style = `display: none`
      this.sceneHideCallback && this.sceneHideCallback(this)
    }, scene.hideDelay || 3000)
  }

  renderLeave (scene) {
    for (let element of scene.elements) {
      element.style = styleUtils.getElementStyle(element, this.device, 'out')
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
}
