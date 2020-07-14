import { getImageUrl } from './imageUtils'

export default {
  props: {
    work: {
      type: Object
    },
    // 渲染当前的场景
    scene: {
      type: Object
    }
  },

  computed: {
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
    }
  },
  methods: {
    getImageUrl
  }
}
