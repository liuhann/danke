import { getImageUrl } from './imageUtils'
import { shortid } from '../../utils/string'
import { getSVGViewBox } from '../../vectors/utils'
import { fitRectIntoBounds, getRectPositionStyle, isPointInRect, intersectRect } from '../mixins/rectUtils.js'
import textMesure from '../../utils/textMesure'
export default {
  props: {
    work: {
      type: Object
    },
    // 当前的场景
    scene: {
      type: Object
    }
  },

  computed: {
    viewBox () {
      return this.work.viewBox
    },
    viewPort () {
      return {
        width: this.work.viewBox.width * this.scale,
        height: this.work.viewBox.height * this.scale
      }
    },
    element () {
      return this.focusedElement
    },
    // 当前唯一选中的元素
    focusedElement () {
      if (this.selectedElements.length === 1) {
        return this.selectedElements[0]
      } else {
        return null
      }
    },

    focusedUrl () {
      if (this.focusedElement && this.focusedElement.url) {
        return this.getImageUrl(this.focusedElement.url)
      } else {
        return null
      }
    },
    selectedElements () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && !el.locked)
      }
      return []
    },
    selectedLockedElements () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && el.locked)
      }
      return []
    },

    currentSceneIndex () {
      return this.work.scenes.indexOf(this.scene)
    },

    scenePrevious () {
      const index = this.currentSceneIndex
      if (index > 0) {
        return this.work.scenes[index - 1]
      } else {
        return null
      }
    },
    sceneNext () {
      const index = this.currentSceneIndex
      if (index < this.work.scenes.length - 1) {
        return this.work.scenes[index + 1]
      } else {
        return null
      }
    }
  },
  methods: {
    getImageUrl,
    createSingleElement (element, x, y) {
      const id = shortid()
      // 此处设置节点的基本属性
      const node = {
        id,
        name: element.name || ('节点' + this.scene.elements.length + 1),
        width: 100,
        height: 100,
        // 样式信息
        style: {},
        variables: [],
        // 动效信息
        animation: {
          enter: [],
          exit: []
        },
        // 其他属性，交互时使用
        locked: false,
        selected: false
      }
      Object.assign(node, element)
      // 设置文字的自适应大小
      if (element.text) {
        node.name = '文本'
        Object.assign(node, textMesure(element.text, element.variables.filter(variable => variable.type === 'fontSize')[0].value))
      }
      // image has mask attr
      if (element.url) {
        if (element.url.endsWith('.svg')) {
          node.fit = 'fill'
        } else {
          node.fit = 'cover'
          node.mask = ''
        }
      }
      if (element.ratio) {
        node.ratio = element.ratio
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
      Object.assign(node, fitRectIntoBounds(node, this.viewBox))

      if (x && y) {
        // 拖拽处理
        node.x = x - node.width / 2
        node.y = y - node.height / 2
      }
      // 自动适应到屏幕内部 避免溢出
      node.x = (node.x < 0) ? 0 : node.x
      node.y = (node.y < 0) ? 0 : node.y

      this.scene.elements.push(node)
      this.setElementSelected(node)
      this.$emit('change')
      return node
    },
    /**
     * 设置单个元素为选中状态, 取消其他元素选中
     */
    setElementSelected (element) {
      for (let e of this.scene.elements) {
        e.selected = false
        // 编辑状态时，如果被编辑元素被选中，则不改变编辑状态
        if (element !== e && e.editing) {
          e.editing = false
        }
      }
      if (element) {
        element.selected = true
      }
    },

    applyFilter (filter) {
      if (this.focusedElement) {
        this.$set(this.focusedElement, 'filter', filter)
      }
    },

    cleanFilter () {
      if (this.focusedElement) {
        this.$set(this.focusedElement, 'filter', null)
      }
    },

    /**
     * append element selecting
     **/
    appendElementSelected (element) {
      for (let e of this.scene.elements) {
        if (e.editing) {
          e.editing = false
        }
      }
      if (element) {
        element.selected = true
      }
    },
  }
}
