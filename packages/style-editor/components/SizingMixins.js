import Draggabilly from 'draggabilly'
export default {
  data () {
    return {
      cornerPosition: {}
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
      this.resizeDraggie.on('dragMove', function (event, pointer, moveVector) {
        vi.setNewSize(vi.resizeDraggie.position)
      })
      // moving
      if (this.draggie) {
        this.draggie.destroy()
      }
      this.draggie = new Draggabilly('.draggabily', {})
      this.draggie.on('dragMove', function (event, pointer, moveVector) {
        vi.setNewPosition(vi.draggie.position)
      })
    },

    setNewPosition ({ x, y }) {
      console.log(x, y)
    },
    setNewSize ({ x, y }) {
      x += 10
      y += 10
      if (this.currentElement.size.width.indexOf('vw')>-1) {
        console.log((x * 100 / this.device.width) + 'vw')
        this.currentElement.size.width = Math.floor(x * 100 / this.device.width) + 'vw'
      } else if (this.currentElement.size.width.indexOf('vh')>-1) {
        this.currentElement.size.width = x * 100 / this.device.height + 'vh'
      } else {
        this.currentElement.size.width = x + 'px'
      }
      if (this.currentElement.size.height.indexOf('vw')>-1) {
        this.currentElement.size.height = Math.floor(y * 100 / this.device.width) + 'vw'
      } else if (this.currentElement.height.width.indexOf('vh')>-1) {
        this.currentElement.size.height = (y * 100 / this.device.height) + 'vh'
      } else {
        this.currentElement.size.height = y + 'px'
      }
    }
  }
}
