import { sceneTypeEnum } from '../danke-core/elements/scene'
import { getElementInnerStyle, getElementStyle, getSceneStyle, getAnimationStyle } from '../danke-core/utils/styles'
import { TypeEnum } from '../danke-core/elements'
/**
 * Loading scenes and  resources then init ticker + views
 */
export default class Danke {
  /**
   * @param work 播放配置文件
   * @param device 设备信息  主要是宽度及高度
   */
  constructor (work, device) {
    this.device = device
    this.scenes = work.scenes
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

  /**
   * 清空场景、元素相关信息
   */
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
  play (audio) {
    this.next()
  }
  pause () {

  }
  resume () {

  }
  stop () {

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
    while (this.displays.current.type !== sceneTypeEnum.COMMON) {
      this.index++
      this.displays.current = this.scenes[this.index]
    }
    // 检查更新前景和背景
    this.checkForBack()
    this.enterScene(this.displays.current)
  }
  /**
   * Trigger to go to previews scene
   */
  previous () {
  }

  checkForBack () {
    // 获取当前场景需要的背景和前景
    let previousBack = null
    let previousFore = null
    for (let i = this.index; i > -1; i--) {
      if (!previousBack && this.scenes[i].type === sceneTypeEnum.BACKGROUND) {
        previousBack = this.scenes[i]
      }
      if (!previousFore && this.scenes[i].type === sceneTypeEnum.FORGROUND) {
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

  /**
   * 渲染进入场景
   * @param scene
   */
  enterScene (scene) {
    if (scene.enterDelay) {
      setTimeout(() => {
        this.renderEnter(scene)
      }, scene.enterDelay)
    } else {
      this.renderEnter(scene)
    }
    this.sceneEnterCallback && this.sceneEnterCallback(this)
    if (!scene.manual) {
      this.pauseForLeave = setTimeout(this.next.bind(this), scene.leave || 3000)
    }
  }

  /**
   * 渲染场景进入相关元素
   * @param scene
   */
  renderEnter (scene) {
    // 处理每个元素的入场动画
    for (let element of scene.elements) {
      element.style = getElementStyle(element, this.device, 'in')
      if (element.type === TypeEnum.IMAGE) {
        // 因为图片是单独的一个内部元素，这里主要是处理动画是否overflow、clip等
        element.innerStyle = getElementInnerStyle(element, this.device, 'in')
      }
    }
    scene.style = `display: inherit; ${getSceneStyle(scene, this.device)}`
  }

  /**
   * 离开场景
   * @param scene
   */
  leaveScene (scene) {
    this.renderLeave(scene)
    this.sceneLeaveCallback && this.sceneLeaveCallback(this)
    const outDura = this.getSceneStageAnimationDura(scene, 'out')
    setTimeout(() => {
      console.log(`scene ${scene.index} left!`)
      scene.style = `display: none`
    }, outDura)
  }

  /**
   * 获取场景进入或者离开时下动态持续的最长时间， 同时考虑repeat的情况
   */
  getSceneStageAnimationDura (scene, stage) {
    let max = 0
    for (let element of scene.elements) {
      let emax = this.getAnimationsMaxDura(element, stage)
      if (emax > max) {
        max = emax
      }
    }
    let smax = this.getAnimationsMaxDura(scene, stage)
    if (smax > max) {
      max = smax
    }
    return max
  }

  /**
   * 获得元素动画的最长持续持剑
   * @param element 元素
   * @param stage 具体阶段
   * @return {number}
   */
  getAnimationsMaxDura (element, stage) {
    let max = 0
    if (element.animations) {
      for (let animation of element.animations) {
        if (animation.stage === stage) {
          let dura = 0
          if (animation.infinite) {
            return Number.MAX_SAFE_INTEGER
          }
          dura = animation.duration * animation.iteration + (animation.delay || 0)
          if (dura > max) {
            max = dura
          }
        }
      }
      return max
    } else {
      return 0
    }
  }

  /**
   * 渲染场景离开
   * @param scene
   */
  renderLeave (scene) {
    for (let element of scene.elements) {
      const outerAnimation = getAnimationStyle(element, 'out', true)
      const innerAnimation = getAnimationStyle(element, 'out', true)
      if (!outerAnimation && !innerAnimation) {
        // element.style = 'display: none'
      } else {
        element.style = getElementStyle(element, this.device, 'out')
        element.innerStyle = getElementInnerStyle(element, this.device, 'out')
      }
    }
    scene.style = `display: inherit; ${getSceneStyle(scene, this.device, 'out')}`
  }
  setDeviceEl (elDevice) {
    this.deviceElement = elDevice
    this.deviceElement.addEventListener('click', (event) => {
      if (this.displays.current.manual) {
        this.next()
      }
    })
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
