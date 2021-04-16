import { shortid, templateNum } from '../../utils/string'
import { getSVGViewBox } from '../../vectors/utils'
import { getImageUrl } from '../../utils/getImageUrl'
import { fitRectIntoBounds, getRectPositionStyle } from '../mixins/rectUtils'
import { assignVariables } from '../mixins/renderUtils'
import sleep from '../../common/utils/sleep'
import debug from 'debug'
import objectPath from 'object-path'

const trace = debug('danke:scene-actions')

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
    stagger: {},
    // 动效信息
    animation: element.animation || {},
    // 其他属性，交互时使用
    locked: false,
    selected: false
  }

  if (node.width < 200) {
    node.height = node.height * 200 / node.width
    node.width = 200
  }
  // 设置文字的自适应大小
  if (element.text) {
    node.name = '文本'
    node.text = element.text
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
      }
    }
  }

  if (element.hasOwnProperty('fill')) {
    node.fill = element.fill
  }

  // SVG处理
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

function getElementMask (element) {
  if (element) {
    if (element.maskImage != null) {
      return getImageUrl(element.maskImage) || 'http://image.danke.fun/public/vector/5fc750e1922370cef95fa314/%E5%9C%86%E5%BD%A2%E5%AE%9A%E4%BD%8D%E7%9B%B8%E6%A1%86.svg'
    }
  }
  return null
}

function elementColorVariables (element) {
  if (element && element.variables) {
    return element.variables.filter(variable => variable.type === 'color')
  } else {
    return []
  }
}
function elementPxVariables (element) {
  if (element && element.variables) {
    return element.variables.filter(variable => variable.type === 'px')
  } else {
    return []
  }
}

/**
 * 设置单个元素为选中状态, 取消其他元素选中
 */
function setElementSelected (scene, element) {
  for (const e of scene.elements) {
    e.selected = false
    // 编辑状态时，如果被编辑元素被选中，则不改变编辑状态
    if (element !== e && e.editing) {
      e.editing = false
    }
  }
  if (element) {
    element.selected = true
  }
}

function generateStagerElements (scene, element) {
  if (element.stager && element.stager.count > 1) {
    for (let i = 0; i < element.stager.count; i++) {
      const staged = JSON.parse(JSON.stringify(element))
      staged.staged = true
      delete staged.stager
      staged.id = shortid()
      if (element.stager.x) {
        staged.x = templateNum(element.stager.x, {
          i,
          template: element
        })
      }
      if (element.stager.y) {
        staged.y = templateNum(element.stager.y, {
          i,
          template: element
        })
      }
      if (element.stager.width) {
        staged.width = templateNum(element.stager.width, {
          i,
          template: element
        })
      }
      if (element.stager.height) {
        staged.height = templateNum(element.stager.height, {
          i,
          template: element
        })
      }

      if (element.stager.animation) {
        for (let key in element.stager.animation) {
          objectPath.set(staged.animation, key, templateNum(objectPath.get(element.animation, key), {
            i,
            template: element
          }))
        }
      }
      scene.elements.push(staged)
      console.log(scene.elements)
    }
  }
}



function elementStyle (element, viewBox, viewPort) {
  // 设置元素的长、宽到默认变量--width 、 --height
  const style = {
    '--width': element.width + 'px',
    '--height': element.height + 'px'
  }

  Object.assign(style, element.style)

  // 填充色情况下，图片显示为遮罩
  if (element.fill && element.url) {
    style.maskImage = `url(${getImageUrl(element.url)})`
    style.maskSize = element.fit || 'cover'
    style.maskPosition = 'center center'
  }
  // 变量配置信息
  assignVariables(style, element.variables)

  if (viewBox && viewPort) {
    // 位置信息
    Object.assign(style, getRectPositionStyle(element, viewBox, viewPort))
  }

  if (element.rotate) {
    const transforms = []
    transforms.push(`rotate(${element.rotate}deg)`)
    if (transforms.length) {
      Object.assign(style, {
        transform: transforms.join(' ')
      })
    }
  }
  // 按大小指定视角
  style.perspective = (element.style.perspective || element.width) + 'px'
  return style
}

async function playScene (scene) {
  trace('scene stage = enter')

  scene.play = true
  for (let element of scene.elements) {
    generateStagerElements(scene, element)
  }
  await sleep((parseInt(scene.fin) - parseInt(scene.enter)) * 1000)

  scene.elements = scene.elements.filter(element => element.staged !== true)
  scene.play = false
}

function toggleElementLock (element) {
  element.locked = !element.locked
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
  elementColorVariables,
  elementPxVariables,
  getElementMask,
  lockElement,
  elementStyle,
  deleteElement,
  setElementSelected,
  toggleElementLock,
  unlockElement,
  generateStagerElements,
  playScene
}
