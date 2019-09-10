import { IMAGE, SHAPE, TEXT, TypeEnum, LAYOUT } from '../../danke-core/elements/index'
import { clone } from '../../utils/object'
import { getElementInnerStyle, getElementStyle, getSceneStyle } from '../../danke-core/utils/styles'
import { interactElement, destoryInteraction } from '../utils/interact'
import { shortid } from '../../utils/string'
import { MessageBox, Message } from 'element-ui'

export default {
  data () {
    return {
      clipboard: {
        elements: [],
        cutFrom: null
      }
    }
  },
  provide () {
    return {
      chooseElement: this.chooseElement,
      insertImage: this.insertImage,
      insertShape: this.insertShape,
      insertText: this.insertText,
      insertLayout: this.insertLayout,
      deleteElement: this.deleteElement,
      fileChoosed: this.fileChoosed,
      svgFileChoosed: this.svgFileChoosed,
      cloneElement: this.cloneElement,
      moveUp: this.moveUp,
      moveDown: this.moveDown,
      moveTop: this.moveTop,
      moveBottom: this.moveBottom,
      cutElement: this.cutElement,
      copyElement: this.copyElement,
      pasteElement: this.pasteElement,
      clipboard: this.clipboard
    }
  },
  watch: {
    currentElement: {
      deep: true,
      handler (val, oldVal, diff) {
        if (this.currentElement) {
          this.currentElement.style = getElementStyle(this.currentElement, this.device)
          this.currentElement.innerStyle = getElementInnerStyle(this.currentElement, this.device)
        }
      }
    },
    // 处理多个元素选中后同时调整X、Y坐标功能
    'currentElement.position.offsetX': function (val) {
      if (this.multipleElements.length > 1) {
        for (let element of this.multipleElements) {
          element.position.offsetX = val
          element.style = getElementStyle(element, this.device)
        }
      }
    },
    'currentElement.position.offsetY': function (val) {
      if (this.multipleElements.length > 1) {
        for (let element of this.multipleElements) {
          element.position.offsetY = val
          element.style = getElementStyle(element, this.device)
        }
      }
    }
  },
  filters: {
    newline (val) {
      return val.replace(/\n/g, '<br>')
    }
  },
  methods: {
    addMenuClicked (menu, event) {
      if (menu.type === 'file') {
        this.fileChoosed(event)
      } else if (menu.label === '文字') {
        this.insertText()
      } else if (menu.label === '形状') {
        this.insertShape()
      }
    },

    svgFileChoosed (e) {
      const builder = this
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        if (file.size > this.ctx.upload.maxSize) {
          Message.error('文件最大为' + Math.floor(this.ctx.upload.maxSize / (1024 * 1024)) + 'M')
          return
        }
        const image = new Image()
        image.onload = function () {
          builder.insertRawImage(file, this.width, this.height)
        }
        image.src = URL.createObjectURL(file)
      }
    },

    fileChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        if (file.size > this.ctx.upload.maxSize) {
          this.error = '文件最大为' + this.ctx.upload.maxSize
        }
        this.croppingFileName = file.name
        this.$refs.cropper.open(file, this.ratio || '16:9')
        this.$refs.cropper.cropCompleteCallback = this.insertImage
        e.currentTarget.value = ''
      }
    },

    insertLayout (template) {
      const cloned = clone(LAYOUT)
      Object.assign(cloned, template)
      cloned.id = shortid()
      cloned.style = getElementStyle(cloned, this.device)
      this.currentScene.layouts.push(cloned)
      this.chooseElement(cloned)
    },
    insertShape (shape) {
      const clonedElement = clone(SHAPE)
      clonedElement.id = shortid()
      clonedElement.name = shape === 'circle' ? '圆形' : '矩形'
      clonedElement.shape = shape
      clonedElement.visible = true
      clonedElement.background.colors = ['#eee']
      clonedElement.size.width = '30vw'
      clonedElement.size.height = '30vw'
      clonedElement.style = getElementStyle(clonedElement, this.device)
      this.inc++
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
    },
    insertText (text) {
      const clonedElement = clone(TEXT)
      clonedElement.id = shortid()
      clonedElement.visible = true
      clonedElement.text = text || '请输入文本内容'
      clonedElement.size.width = '50vw'
      clonedElement.size.height = '30px'
      if (this.ctx.fontCopied) {
        clonedElement.font = JSON.parse(JSON.stringify(this.ctx.fontCopied))
      }
      clonedElement.style = getElementStyle(clonedElement, this.device)
      this.inc++
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
    },
    insertImage (croppedList, cropScreenSize) {
      const elements = []
      for (let { blob, cropbox } of croppedList) {
        const clonedElement = clone(IMAGE)
        clonedElement.id = shortid()
        clonedElement.name = '图片'
        clonedElement.visible = true
        clonedElement.position.horizontal = 'left'
        clonedElement.position.vertical = 'top'
        clonedElement.border.width = 0
        const sizeWidth = Math.floor(100 * cropbox.width / cropScreenSize.width)
        const sizeHeight = Math.floor(100 * cropbox.height / cropScreenSize.height)
        clonedElement.size.width = (sizeWidth > 100 ? 100 : sizeWidth) + 'vw'
        clonedElement.size.height = (sizeHeight > 100 ? 100 : sizeHeight) + 'vh'
        clonedElement.position.offsetX = Math.floor((100 * cropbox.left || 0) / cropScreenSize.width) + 'vw'
        clonedElement.position.offsetY = Math.floor((100 * cropbox.top || 0) / cropScreenSize.height) + 'vh'
        const resourceUrl = URL.createObjectURL(blob)
        clonedElement.url = resourceUrl
        clonedElement.blob = blob
        const style = getElementStyle(clonedElement, this.device)
        clonedElement.style = style
        this.currentScene.elements.push(clonedElement)
        elements.push(clonedElement)
        blob.filename = this.croppingFileName
      }
    },
    insertRawImage (file, width, height) {
      const clonedElement = clone(IMAGE)
      clonedElement.id = shortid()
      clonedElement.name = '图片'
      clonedElement.visible = true
      clonedElement.position.horizontal = 'center'
      clonedElement.position.vertical = 'center'
      clonedElement.border.width = 0
      clonedElement.size.width = '50vw'
      clonedElement.size.height = '50vw'
      clonedElement.url = URL.createObjectURL(file)
      clonedElement.blob = file
      const style = getElementStyle(clonedElement, this.device)
      clonedElement.style = style
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
    },

    deleteElement (element) {
      MessageBox.confirm('确认删除元素，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.currentElement.id === element.id) {
          this.currentElement = null
          this.multipleElements = []
        }
        for (let i = 0; i < this.currentScene.elements.length; i++) {
          if (this.currentScene.elements[i].id === element.id) {
            this.currentScene.elements.splice(i, 1)
            break
          }
        }
      })
    },
    contentChange (e) {
      this.editedText = e.target.innerHTML.replace(/<br>/g, '\n')
    },
    chooseElement (element, event) {
      this.elementChoosed && this.elementChoosed()
      // 选择的就是当前元素、忽略
      if (this.currentElement && element && this.currentElement.id === element.id) {
        return
      }
      // 销毁现有推拽
      if (this.currentElement && this.interactEnabled) {
        destoryInteraction(document.getElementById('element-' + this.currentElement.id))
      }
      if (event && event.ctrlKey && this.multipleElements.length > 0) {
        this.addMultipleElement(element)
      } else {
        if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.editedText) {
          this.currentElement.text = this.editedText
          this.editedText = null
        }
        if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.currentElement.text === '') {
          this.currentElement.text = ' '
        }
        this.currentElement = element
        if (element) {
          this.multipleElements = [element]
          if (this.interactEnabled) {
            this.$nextTick(() => {
              interactElement(document.getElementById('element-' + element.id), element, this)
            })
          }
        } else {
          this.multipleElements = []
        }
      }
    },
    addMultipleElement (element) {
      if (element) {
        this.multipleElements.push(element)
      }
    },
    cloneElement (element) {
      const clonedElement = clone(element)
      clonedElement.id = shortid()
      clonedElement.visible = true
      clonedElement.style = getElementStyle(clonedElement, this.device)
      this.inc++
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
    },
    moveUp (element) {
      const elementIndex = this.currentScene.elements.indexOf(element)
      if (elementIndex === 0) {
        return
      }
      this.$set(this.currentScene.elements, elementIndex, this.currentScene.elements[elementIndex - 1])
      this.$set(this.currentScene.elements, elementIndex - 1, this.currentElement)
    },

    moveDown (element) {
      const elementIndex = this.currentScene.elements.indexOf(element)
      if (elementIndex === this.currentScene.elements.length - 1) {
        return
      }
      this.$set(this.currentScene.elements, elementIndex, this.currentScene.elements[elementIndex + 1])
      this.$set(this.currentScene.elements, elementIndex + 1, this.currentElement)
    },

    moveTop (element) {
      let elementIndex = this.currentScene.elements.indexOf(element)
      while (elementIndex > 0) {
        this.moveUp(element)
        elementIndex = this.currentScene.elements.indexOf(element)
      }
    },

    moveBottom (element) {
      let elementIndex = this.currentScene.elements.indexOf(element)
      while (elementIndex < this.currentScene.elements.length - 1) {
        this.moveDown(element)
        elementIndex = this.currentScene.elements.indexOf(element)
      }
    },

    // 拷贝当前选择元素到剪贴板
    copyElement () {
      this.clipboard.elements = this.multipleElements
      this.clipboard.cutFrom = null
      Message.info('元素已经拷贝到剪贴板')
    },
    // 剪切当前选择元素到剪贴板
    cutElement () {
      this.clipboard.elements = this.multipleElements
      this.clipboard.cutFrom = this.currentScene
      Message.info('元素已经剪切到剪贴板')
    },
    // 从剪切板粘贴 可能跨场景
    pasteElement () {
      if (this.clipboard.cutFrom) {
        for (let element of this.clipboard.elements) {
          this.clipboard.cutFrom.elements.splice(this.clipboard.cutFrom.elements.indexOf(element), 1)
          this.currentScene.elements.push(element)
        }
      } else {
        for (let element of this.clipboard.elements) {
          const cloned = JSON.parse(JSON.stringify(element))
          cloned.id = shortid()
          this.currentScene.elements.push(cloned)
        }
      }
      Message.info('元素已经粘贴')
      this.clipboard.elements = []
    },

    reflow () {
      for (let scene of this.work.scenes) {
        for (let element of scene.elements) {
          if (element.imgPath) {
            element.url = this.ctx.IMG_SERVER + '/' + element.imgPath
          }
          element.style = getElementStyle(element, this.device)
          element.innerStyle = getElementInnerStyle(element, this.device)
        }
        scene.style = getSceneStyle(scene, this.device)
      }
    }
  }
}
