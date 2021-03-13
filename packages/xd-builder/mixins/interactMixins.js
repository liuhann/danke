import interact from 'interactjs'
import { CouponList } from 'vant'
import { shortid } from '../../utils/string'

export default {
  methods: {
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
            for (const element of this.scene.elements) {
              if (element.selected) {
                element.x += Math.floor(event.dx / this.scale)
                element.y += Math.floor(event.dy / this.scale)
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
          const elementResize = {
            x: element.x * xRatio,
            y: element.y * yRatio,
            width: element.width * xRatio,
            height: element.height * yRatio
          }
          if (element.ratio) {
            elementResize.height = elementResize.width * element.ratio
          }
          if (node.elements && node.elements.length) {
            this.resizeBlockElements(element, elementResize)
          }
          Object.assign(element, elementResize)
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
      console.log('init drag resize', node)
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
            preserveAspectRatio: node.isRatioFixed
          }).on('resizemove', event => {
            const target = {
              width: event.rect.width / this.scale,
              height: event.rect.height / this.scale,
              x: node.x + event.deltaRect.left / this.scale,
              y: node.y + event.deltaRect.top / this.scale
            }
            if (node.ratio) {
              target.height = target.width * node.ratio
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
            onstart: event => {
              if (event.ctrlKey) {
                // ctrl 拖拽： 复制当前元素放置在原地
                for (let element of this.selectedElements) {
                  const cloned = JSON.parse(JSON.stringify(element))
                  cloned.id = shortid()
                  cloned.selected = false
                  this.scene.elements.splice(this.scene.elements.indexOf(element), 0, cloned)
                  // this.scene.elements.push(cloned)
                  this.$nextTick(() => {
                    this.initElementDragResize(cloned)
                  })
                }
              }
            },
            onmove: event => {
              for (const element of this.selectedElements) {
                element.x += Math.floor(event.dx / this.scale)
                element.y += Math.floor(event.dy / this.scale)
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
