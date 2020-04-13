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
     * 重设元素是否允许缩放、移动
     * @param node
     */
    setElementLocked (node, locked) {
      if (locked) {
        const el = document.getElementById('mask-' + node.id)
        if (el) {
          interact(el).unset()
        }
      } else {
        this.initElementDragResize(node)
      }
    },

    /**
     * 调整组大小时同时按比例调整所有子元素的大小和形状
     * @param node
     * @param target
     */
    resizeBlockElements (node, target) {
      if (node.elements && node.elements.length) {
        // 按比例缩放子元素
        const xRatio = target.width / node.width
        const yRatio = target.height / node.height
        for (let element of node.elements) {
          element.x = element.x * xRatio
          element.width = element.width * xRatio
          element.y = element.y * yRatio
          element.height = element.height * yRatio
          if (element.variables) {
            let fonts = element.variables.filter(variable => variable.type === 'fontSize')
            if (fonts.length) {
              fonts.forEach(f => {
                f.value = f.value * xRatio
              })
            }
          }
        }
      }
    },
    /**
     * 初始化元素interact拖拽功能
     */
    initElementDragResize (node) {
      const el = document.getElementById('mask-' + node.id)
      if (el) {
        const interactee = interact(el)
        if (!interactee.resizable().enabled) {
          interactee.resizable({
            edges: {
              left: '.resize-l',
              right: '.resize-r',
              bottom: '.resize-b',
              top: '.resize-t'
            },
            inertia: true,
            preserveAspectRatio: node.isRatioFixed
          }).on('resizemove', event => {
            const target = {
              width: event.rect.width / this.scale,
              height: event.rect.height / this.scale,
              x: node.x + event.deltaRect.left / this.scale,
              y: node.y + event.deltaRect.top / this.scale
            }
            if (node.elements && node.elements.length) {
              this.resizeBlockElements(node, target)
            }
            Object.assign(node, target)
          }).on('resizeend', event => {
            this.$emit('change')
          })
        }
        if (!interactee.draggable().enabled) {
          interactee.draggable({
            inertia: true,
            onmove: event => {
              for (let element of this.scene.elements) {
                if (element.selected && !element.locked) {
                  element.x += event.dx / this.scale
                  element.y += event.dy / this.scale
                }
              }
            },
            onend: event => {
              this.$emit('change')
            }
          })
        }
      }
    }
  }
}
