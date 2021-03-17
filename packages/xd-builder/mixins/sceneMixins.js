export default {
  computed: {
    // 当前唯一选中的元素
    focusedElement () {
      if (this.selectedElements.length === 1) {
        return this.selectedElements[0]
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
    focusedFont () {
      return this.focusedElement &&  this.focusedElement.text != null
    },
    selectedLockedElements () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && el.locked)
      }
      return []
    },
    sceneIndex () {
      return this.work.scenes.indexOf(this.scene) + 1
    },
    selectedImages () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && !el.locked && el.url)
      }
      return []
    },
    /**
     * 获取场景class列表
     */
    sceneClass () {
      const classes = []
      for (let key in this.scene.style) {
        if (this.scene.style[key] && this.scene.style[key].name) {
          classes.push(this.scene.style[key].name)
        }
      }
      return classes
    },
    selectedTexts () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected && el.text != null)
      }
      return []
    },
    noFocusedElement () {
      if (this.scene && this.scene.elements) {
        return this.scene.elements.filter(el => el.selected).length === 0
      }
      return false
    },

    elementMasktable () {
      if (this.focusedElement && !this.focusedFont) {
        return true
      } else {
        return false
      }
    }
  },
  data () {
    return {}
  }
}
