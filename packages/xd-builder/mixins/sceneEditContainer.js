import { getImageUrl } from '../../utils/getImageUrl'
import { createSingleElement } from '../utils/sceneActions'
import { getRectPositionStyle } from '../mixins/rectUtils.js'
import { fitToCenter } from '../utils/canvasAction'

const WORKSPACE_PADDING = 20
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
      // 屏幕在工作区横向位置
      translateX: 0,
      // 屏幕区在工作区纵向位置
      translateY: 0,
      deviceScreenPadding: 10,
      // 工作区大小， 屏幕、拖拽及选择遮罩都在工作区内部
      containerSize: {
        width: 360,
        height: 360
      }
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
    this.onMounted()
  },

  methods: {
    getImageUrl,
    getRectPositionStyle,

    fitToCenter () {
      const fit = fitToCenter(this.containerSize, this.work.viewBox, WORKSPACE_PADDING)
      this.translateX = fit.translateX
      this.translateY = fit.translateY
      this.scaleSelected = fit.scale
    },

    center () {
      this.translateX = (this.containerSize.width - this.viewBox.width * this.scale) / 2
      this.translateY = (this.containerSize.height - this.viewBox.height * this.scale) / 2
    },

    onMounted () {
      this.containerSize.width = this.$el.clientWidth
      this.containerSize.height = this.$el.clientHeight
      this.fitToCenter()
      this.initGlobalInteract()
      this.setElementsInteract()
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
