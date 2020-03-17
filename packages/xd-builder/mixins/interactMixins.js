import interact from 'interactjs'

export default {
  methods : {
    /**
     * only drag
     * @param node
     */
    initElementDrag (node) {
      const el = document.getElementById('mask-' + node.id)
      if (el) {
        interact(el).draggable({
          allowFrom: '.drag-handle',
          onstart: event => {},
          inertia: true,
          onmove: event => {
            for (let element of this.scene.elements) {
              if (element.selected) {
                element.x += event.dx / this.scale
                element.y += event.dy / this.scale
              }
            }
          },
          onend: event => { }
        })
      }
    },

    /**
     * 销毁元素的interaction
     */
    destroyInteract (node) {
      const el = document.getElementById('mask-' + node.id)
      if (el) {
        interact(el).unset()
      }
    },
    /**
     * 初始化元素interact拖拽功能
     */
    initElementDragResize (node) {
      const el = document.getElementById('mask-' + node.id)
      if (el) {
        interact(el).resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          inertia: true,
          preserveAspectRatio: node.isRatioFixed
        }).on('resizemove', event => {
          node.width = event.rect.width / this.scale
          node.height = event.rect.height / this.scale
          node.x += event.deltaRect.left / this.scale
          node.y += event.deltaRect.top / this.scale
        }).draggable({
          onstart: event => {},
          inertia: true,
          onmove: event => {
            for (let element of this.scene.elements) {
              if (element.selected) {
                element.x += event.dx / this.scale
                element.y += event.dy / this.scale
              }
            }
          },
          onend: event => { }
        })
      }
    }
  }
}
