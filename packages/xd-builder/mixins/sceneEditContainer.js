import { getImageUrl } from '../../utils/getImageUrl'
import { shortid } from '../../utils/string'
import { getSVGViewBox } from '../../vectors/utils'
import { createSingleElement } from '../utils/sceneActions'
import { fitRectIntoBounds, getRectPositionStyle, isPointInRect, intersectRect } from '../mixins/rectUtils.js'
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
    // this.setElementsInteract()
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
      this.translateX = (this.containerSize.width - fitSize.width) / 2
      this.translateY = (this.containerSize.height - fitSize.height) / 2
    },

    createSingleElement (element, x, y) {
      const created = createSingleElement(element, this.viewBox, x, y)
      this.scene.elements.push(created)
      this.setElementSelected(this.scene, created)
      this.$emit('change')
      return node
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
