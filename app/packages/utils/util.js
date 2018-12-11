const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const REG_LEN = /([+-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/
function getLength (len, scale) {
  // -15vw ->  [-15vw,-15,vw]
  const splits = REG_LEN.exec(len)
  if (splits[2] === 'vw') {
    return Math.floor(scale.width * Number.parseFloat(splits[1]) / 100)
  } else if (splits[2] === 'vh') {
    return Math.floor(scale.height * Number.parseFloat(splits[1]) / 100)
  }
}

function getElementStyle (element, device, coordinate, inOrOut) {
  const elementStyle = []
  elementStyle.push(`left: ${getLength(element.x, device)}px`)
  if (coordinate === 'center') {
    let y = device.height / 2 + getLength(element.y, device)
    elementStyle.push(`top: ${y}px`)
  } else {
    elementStyle.push(`top: ${getLength(element.y, device)}px`)
  }

  if (element.width) {
    elementStyle.push(`width: ${getLength(element.width, device)}px`)
  }
  if (element.height) {
    elementStyle.push(`height: ${getLength(element.height, device)}px`)
  }
  if (element.radius) {
    elementStyle.push(`height: ${getLength(element.radius, device) * 2}px`)
    elementStyle.push(`width: ${getLength(element.radius, device) * 2}px`)
  }
  if (element.style) {
    elementStyle.push(element.style)
  }

  if (element.type === 'typing') {
    elementStyle.push(`font-size:${getLength(element.fontSize, device)}px;background: ${element.background}; color: ${element.color}`)
  }
  if (element.type === 'circle') {
    elementStyle.push(`border-radius: ${element.radius}`)
  }

  if (element.in && inOrOut === 'in') {
    if (element.in.animation) {
      elementStyle.push(`animation-duration:${element.in.duration}`)
      if (element.in.delay) {
        elementStyle.push(`animation-delay:${element.in.delay}`)
      }
    }
    if (element.in.style) {
      elementStyle.push(element.in.style)
    }
  }

  if (element.out && inOrOut === 'out') {
    if (element.out.animation) {
      elementStyle.push(`animation-duration:${element.out.duration}`)
      if (element.out.delay) {
        elementStyle.push(`animation-delay:${element.out.delay}`)
      }
    }
    if (element.out.style) {
      elementStyle.push(element.in.style)
    }
  }
  return elementStyle
}

function getImageBosUrlByDevice (bosKey, device, imgElementDef) {
  const actualWidth = getLength(imgElementDef.width, device) * 2
  const actualHeight = getLength(imgElementDef.height, device) * 2
  return `http://danke.cdn.bcebos.com/${bosKey}@s_2,w_${actualWidth},h_${actualHeight},q_100`
}

function getImageBosUrlBySize (bosKey, width, height) {
  width = Math.floor(width)
  height = Math.floor(height)
  if (bosKey) {
    return `http://danke.cdn.bcebos.com/${bosKey}@s_2,w_${width},h_${height},q_100`
  } else {
    return `http://danke.cdn.bcebos.com/000/empty.png@s_1,w_${width},h_${height},q_100`
  }
}

function clone (obj) {
  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj

  // Handle Array
  if (obj instanceof Array) {
    let copy = []
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    let copy = {}
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }

  return obj
}

function randomRangeId (num) {
  let returnStr = ''
  const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < num; i++) {
    let index = Math.round(Math.random() * (charStr.length - 1))
    returnStr += charStr.substring(index, index + 1)
  }
  return returnStr
}

function shortid (length) {
  return randomRangeId(length || 6)
}

/**
 * 从模板初始化到work
 * @param templateDef 模板定义
 * @param device  设备信息
 * @returns {{template: *, name: SVGDescElement, scenes: Array}}
 */
function initializeWork (templateDef, device) {
  const work = {
    coordinate: templateDef.coordinate,
    uid: shortid(10),
    template: templateDef.id,
    name: templateDef.desc,
    scenes: [],
    templates: []
  }

  // 按预定义生成一些默认的场景
  if (templateDef.scenes) {
    for (let scene of templateDef.scenes) {
      if (typeof scene === 'number') { // 数字表示从模板中复制  这样的场景可删除
        const sceneCloned = clone(templateDef.templates[scene])
        sceneCloned.coordinate = templateDef.coordinate
        work.scenes.push(generatePreviewSizing(sceneCloned, device))
      } else { // 不可删除的场景
        const sceneCloned = clone(scene)
        sceneCloned.fixed = true
        work.scenes.push(generatePreviewSizing(sceneCloned, device))
      }
    }
  }

  // 模板的默认样式， 供选择模板时使用
  for (let template of templateDef.templates) {
    template.coordinate = templateDef.coordinate
    for (let element of template.elements) {
      element.inlineStyle = getElementStyle(element,
        {
          width: device.width * 0.2,
          height: device.width * 0.4
        }, templateDef.coordinate, null).join(';')
    }
    work.templates.push(template)
  }
  return work
}

/**
 * 生成场景全屏展示的样式+底部导航缩略 样式
 * scene.element[i].inlineStyle
 * scene.element[i].navStyle
 * @param scene 场景定义
 * @param device 屏幕、展示尺寸
 * @returns {*}
 */
function generatePreviewSizing (scene, device) {
  for (let element of scene.elements) {
    // 默认定位、大小
    element.inlineStyle = getElementStyle(element, {
      width: device.width,
      height: device.height
    }, scene.coordinate, null).join(';')
    // 导航的定位、大小
    element.navStyle = getElementStyle(element, {
      width: device.width * 0.12,
      height: device.width * 0.24
    }, scene.coordinate, null).join(';')
  }
  return scene
}

function generateSceneDisplayStyle (scene, device, coordinate) {
  const elements = []
  for (let element of scene.elements) {
    const cloned = clone(element)
    cloned.displayStyle = getElementStyle(cloned, {
      width: device.width,
      height: device.height
    }, scene.coordinate, null).join(';')
    elements.push(cloned)
  }
  return {
    elements
  }
}

/**
 * 获取一个work的草稿， 草稿可以用于再次编辑，其返回结果应该和 initializeWork 具有一样的数据结构
 * @param work 包含work基本元数据信息
 * @param scenes 场景信息  因为编辑器页面基本修改的就是场景
 * @returns {{coordinate: (*|string), uid: string | *, template: *, name: SVGDescElement | *, scenes: *, templates: Array, isDraft: boolean}}
 */
function saveWorkDraft (work, scenes) {
  const images = getWorkImages(work)
  const draft = {
    uid: work.uid,
    coordinate: work.coordinate,
    template: work.template,
    name: work.name,
    scenes: scenes,
    templates: work.templates,
    isDraft: true
  }
  if (images.length) {
    draft.cover = images[0]
  }
  return draft
}

function generateWorkStyleByDevice (work, device) {
  if (work.scenes) {
    for (let i = 0; i < work.scenes.length; i++) {
      this.generatePreviewSizing(work.scenes[i], device)
    }
  }
}

function getSaveWork (work, scenes) {
  const save = {
    uid: work.uid,
    coordinate: work.coordinate,
    template: work.template,
    name: work.name,
    scenes: scenes,
    transitions: [],
    isDraft: false
  }
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i]
    if (!checkScene(scene)) {
      return null
    }
    for (let element of scene.elements) {
      delete element.inlineStyle
      delete element.navStyle
    }
    save.transitions.push({
      from: i - 1,
      to: i
    })
  }
  const images = getWorkImages(work)
  if (images.length) {
    save.cover = images[0]
  }
  save.images = images
  return save
}

/**
 * 获取work中所有包含的图片， 这个方法一般供生成work的封面使用
 * @param work
 * @returns {Array}
 */
function getWorkImages (work) {
  const images = []
  for (let i = 0; i < work.scenes.length; i++) {
    for (let element of work.scenes[i].elements) {
      if (element.type === 'image' && element.bosid) {
        images.push(element.bosid)
      }
    }
  }
  return images
}

/**
 * 检查单个scene的图片是否都已填上 未来考虑可以去掉这个检测
 * @param scene
 * @returns {boolean}
 */
function checkScene (scene) {
  for (let element of scene.elements) {
    if (element.type === 'image' && !element.bosid && element.required) {
      return false
    }
  }
  return true
}

export default {
  formatTime,
  getElementStyle,
  clone,
  shortid,
  getImageBosUrlByDevice,
  getImageBosUrlBySize,
  initializeWork,
  generateSceneDisplayStyle,
  generatePreviewSizing,
  generateWorkStyleByDevice,
  saveWorkDraft,
  getSaveWork
}
