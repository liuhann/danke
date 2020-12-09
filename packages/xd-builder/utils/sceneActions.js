import { shortid } from '../../utils/string'
import textMesure from '../../utils/textMesure'
import { getSVGViewBox } from '../../vectors/utils'
import { fitRectIntoBounds } from '../mixins/rectUtils'

function createSingleElement (element, viewBox, x, y) {
  const id = shortid()
  // 此处设置节点的基本属性
  const node = {
    id,
    name: element.name || element.title,
    width: element.width || element.w || 200,
    height: element.height || element.h || 200,
    // 样式信息
    style: element.style || {},
    variables: element.variables || [],
    // 动效信息
    animation: element.animation || {
      enter: [],
      exit: [],
      preview: []
    },
    // 旋转
    rotate: 0,
    // 其他属性，交互时使用
    locked: false,
    selected: false
  }
  if (node.width < 200) {
    node.height = node.height * 200 / node.width
    node.width = 200
  }
  node.variables = element.variables
  // 设置文字的自适应大小
  if (element.text) {
    node.name = '文本'
    node.text = element.text
    Object.assign(node, textMesure(element.text, element.variables.filter(variable => variable.type === 'fontSize')[0].value))
  }
  if (element.html) {
    node.html = element.html
  }
  // image has mask attr
  if (element.url) {
    node.url = element.url
    if (!element.fit) {
      if (element.url.endsWith('.svg')) {
        node.fit = 'fill'
      } else {
        node.fit = 'cover'
        node.mask = null
      }
    }
  }

  if (element.hasOwnProperty('fill')) {
    node.fill = element.fill
  }

  if (element.content && element._id) {
    node.svg = element._id
    node.content = element.content
    const size = getSVGViewBox(node.content)
    if (size) {
      Object.assign(node, size)
    }
  }
  // 获取元素自适应到整个画面的高度和宽度 避免扩大超出
  Object.assign(node, fitRectIntoBounds(node, viewBox))

  if (x && y) {
    // 拖拽处理
    node.x = x - node.width / 2
    node.y = y - node.height / 2
    // 自动适应到屏幕内部 避免溢出
    node.x = (node.x < 0) ? 0 : node.x
    node.y = (node.y < 0) ? 0 : node.y
  } else {
    node.x = (viewBox.width - node.width) / 2
    node.y = (viewBox.height - node.height) / 2
  }

  return node
}

function moveTop (element, scene) {
  while (moveUp(element, scene)) {}
}

function moveUp (element, scene) {
  const index = scene.elements.indexOf(element)
  if (index === scene.elements.length - 1) {
    return false
  } else {
    scene.elements[index] = scene.elements[index + 1]
    scene.elements[index + 1] = element
    return true
  }
}
function moveBottom (element, scene) {
  while (moveDown(element, scene)) {}
}

function moveDown (element, scene) {
  const index = scene.elements.indexOf(element)
  if (index === 0) {
    return false
  } else {
    scene.elements[index] = scene.elements[index - 1]
    scene.elements[index - 1] = element
    return true
  }
}

function deleteElement (element, scene) {
  scene.elements.splice(scene.elements.indexOf(element), 1)
}

function lockElement (element) {
  element.locked = true
}

function unlockElement (element) {
  element.locked = false
}

export {
  moveTop,
  moveUp,
  moveBottom,
  moveDown,
  createSingleElement,
  lockElement,
  deleteElement,
  unlockElement
}
