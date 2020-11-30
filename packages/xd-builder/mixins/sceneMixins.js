import { shortid } from '../../utils/string'
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
      if (this.currentScene && this.currentScene.elements) {
        return this.currentScene.elements.filter(el => el.selected && !el.locked)
      }
      return []
    }
  },
  data () {
    return {}
  },
  methods: {
    /**
     * 增加新的场景
     */
  }
}
