import Mousetrap from 'mousetrap'
import { shortid } from '../../utils/string'

export default {
  mounted () {
    Mousetrap.bind('left', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.x -= 1
        })
      }
    })
    Mousetrap.bind('right', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.x += 1
        })
      }
    })

    Mousetrap.bind('up', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.y -= 1
        })
      }
    })

    Mousetrap.bind('down', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.y += 1
        })
      }
    })
    Mousetrap.bind('ctrl+left', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.x -= 5
        })
      }
    })
    Mousetrap.bind('ctrl+right', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.x += 5
        })
      }
    })
    Mousetrap.bind('ctrl+up', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.y -= 5
        })
      }
    })
    Mousetrap.bind('ctrl+down', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.y += 5
        })
      }
    })
    Mousetrap.bind('alt+left', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.width -= 1
        })
      }
    })
    Mousetrap.bind('alt+right', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.width += 1
        })
      }
    })

    Mousetrap.bind('alt+up', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.height -= 1
        })
      }
    })

    Mousetrap.bind('alt+down', () => {
      if (this.selectedElements.length) {
        this.selectedElements.forEach(element => {
          element.height += 1
        })
      }
    })

    Mousetrap.bind('del', () => {
      if (this.selectedElements.length) {
        for (let element of this.selectedElements) {
          this.scene.elements.splice(this.scene.elements.indexOf(element), 1)
        }
        this.$emit('change')
      }
    })

    Mousetrap.bind('ctrl+c', () => {
      if (this.selectedElements.length) {
        this.pasteBoard = JSON.stringify(this.selectedElements)
      }
    })

    Mousetrap.bind('ctrl+v', () => {
      if (this.pasteBoard) {
        const elements = JSON.parse(this.pasteBoard)
        // 拷贝元素
        for (let element of elements) {
          element.selected = false
          element.id = shortid()
          element.selected = true
          element.x += 10
          element.y += 10
          this.scene.elements.push(element)
          this.$nextTick(() => {
            this.initElementDragResize(element)
          })
        }
      }
    })

    Mousetrap.bind('wheel', () => {
      console.log('wheel')
    })

    Mousetrap.bind('ctrl+z', () => {
      this.$emit('undo')
    })
  }
}
