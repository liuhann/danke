import Draggabilly from 'draggabilly'
import { getLength, revertLength, getPositionSizingStyle } from '../../../danke-core/utils/styles'
export default {
  data () {
    return {
      draggingRect: false, // if resizing or dragging the mask is moved
      maskStyle: ''
    }
  },
  mounted () {
    this.initDraggie()
  },
  methods: {
    initDraggie () {
      let vi = this
      // resizing
      if (this.resizeDraggie) {
        this.resizeDraggie.destroy()
      }
      this.resizeDraggie = new Draggabilly('.corner-point', {})
      this.resizeDraggie.on('dragEnd', function (event, pointer, moveVector) {
        vi.draggingRect = false
      })
      this.resizeDraggie.on('dragMove', function (event, pointer, moveVector) {
        vi.draggingRect = true
        vi.maskStyle = getPositionSizingStyle(vi.currentElement, vi.device)
        vi.setNewSize(vi.resizeDraggie.position)
      })
      // moving
      if (this.draggie) {
        this.draggie.destroy()
      }
      this.draggie = new Draggabilly('.draggabily', {
        handle: '.handler'
      })
      this.draggie.on('dragEnd', function (event, pointer, moveVector) {
        vi.draggingRect = false
      })
      this.draggie.on('dragMove', function (event, pointer, moveVector) {
        vi.draggingRect = true
        vi.setNewPosition(vi.draggie.position)
      })
    },
    setNewPosition ({ x, y }) {
      const element = this.currentElement
      if (element.position.vertical === 'top') {
        element.position.offsetY = revertLength(y, element.position.offsetY, this.device)
      } else if (element.position.vertical === 'center') {
        element.position.offsetY = revertLength(y + getLength(element.size.height, this.device) / 2 - this.device.height / 2, element.position.offsetY, this.device)
      } else if (element.position.vertical === 'bottom') {
        element.position.offsetY = revertLength(this.device.height - y, element.position.offsetY, this.device)
      }
      if (element.position.horizontal === 'left') {
        element.position.offsetX = revertLength(x, element.position.offsetX, this.device)
      } else if (element.position.horizontal === 'center') {
        element.position.offsetX = revertLength(x + getLength(element.size.width, this.device) / 2 - this.device.width / 2, element.position.offsetX, this.device)
      } else if (element.position.horizontal === 'right') {
        element.position.offsetX = revertLength(this.device.width - x, element.position.offsetX, this.device)
      }
    },
    setNewSize ({ x, y }) {
      x += 10
      y += 10
      if (this.currentElement.size.width.indexOf('vw') > -1) {
        this.currentElement.size.width = Math.floor(x * 100 / this.device.width) + 'vw'
      } else if (this.currentElement.size.width.indexOf('vh') > -1) {
        this.currentElement.size.width = x * 100 / this.device.height + 'vh'
      } else {
        this.currentElement.size.width = x + 'px'
      }
      if (this.currentElement.size.height.indexOf('vw') > -1) {
        this.currentElement.size.height = Math.floor(y * 100 / this.device.width) + 'vw'
      } else if (this.currentElement.height.width.indexOf('vh') > -1) {
        this.currentElement.size.height = (y * 100 / this.device.height) + 'vh'
      } else {
        this.currentElement.size.height = y + 'px'
      }
    }
  }
}
