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

  data () {
    return {
      deviceScreenPadding: 10,
      // 工作区大小， 屏幕、拖拽及选择遮罩都在工作区内部
      containerSize: {
        width: 360,
        height: 360
      },
      // 屏幕区域缩放比例
      scale: 0.2
    }
  },

  computed: {
    // 作品实际大小
    viewBox () {
      return this.work.viewBox || {
        width: 640,
        height: 640
      }
    },
    // 在当前工作区的大小（实际是附加了缩放信息）
    viewPort () {
      console.log('update viewport', this.scale)
      return {
        width: this.viewBox.width * this.scale,
        height: this.viewBox.height * this.scale
      }
    },

    // 当前设备大小信息
    styleWorkContainer () {
      const style = {
        width: this.containerSize.width + 'px',
        height: this.containerSize.height + 'px'
      }
      if (this.actionMove) {
        style.cursor = 'move'
      }
      return style
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

  mounted: function () {
    this.containerSize.width = this.$el.clientWidth
    this.containerSize.height = this.$el.clientHeight
    this.fitToCenter()
    this.initGlobalInteract()
    this.setElementsInteract()
  },

  methods: {
    getImageUrl,
    getRectPositionStyle,

    /**
     * 将屏幕放置到设计区正中央，同时修改屏幕位置偏移量
     */
    fitToCenter () {
      // 上下左右边距30px  自适应到容器大小
      const fitSize = fitRectIntoBounds(this.viewBox, {
        width: this.containerSize.width - this.deviceScreenPadding * 2,
        height: this.containerSize.height - this.deviceScreenPadding * 2
      })
      // 自适应后，伸缩的比率
      this.scale = fitSize.width / this.viewBox.width
      console.log('fit to center', this.containerSize, this.viewBox, this.scale)
      if (fitSize.fitTo === 'width') {
        this.translateX = this.deviceScreenPadding
        this.translateY = (this.containerSize.height - fitSize.height) / 2
      } else {
        this.translateX = (this.containerSize.width - fitSize.width) / 2
        this.translateY = this.deviceScreenPadding
      }
    },

    createSingleElement (element, x, y) {
      const id = shortid()
      // 此处设置节点的基本属性
      const node = {
        id,
        name: element.name || element.title || ('节点' + this.scene.elements.length + 1),
        width: element.width || 200,
        height: element.height || 200,
        // 样式信息
        style: element.style || {},
        variables: element.variables || [],
        // 动效信息
        animation: element.animation || {
          enter: [],
          exit: [],
          preview: []
        },
        rotate: 0,
        rotateX: false,
        rotateY: false,
        template: false,
        // 其他属性，交互时使用
        locked: false,
        selected: false
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
