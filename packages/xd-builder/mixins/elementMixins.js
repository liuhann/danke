import { IMAGE, SHAPE, TEXT, TypeEnum, SVG } from '../../danke-core/elements/index'
import { clone } from '../../utils/object'
import { getElementStyle, getSceneStyle } from '../../danke-core/utils/styles'
import { interactElement, destoryInteraction } from '../utils/interact'
import { shortid } from '../../utils/string'
import { MessageBox } from 'element-ui'

export default {
  data () {
    return {
    }
  },
  provide () {
    return {
      chooseElement: this.chooseElement,
      insertImage: this.insertImage,
      insertShape: this.insertShape,
      insertText: this.insertText,
      deleteElement: this.deleteElement,
      fileChoosed: this.fileChoosed,
      svgFileChoosed: this.svgFileChoosed,
      cloneElement: this.cloneElement,
      moveUp: this.moveUp,
      moveDown: this.moveDown,
      moveTop: this.moveTop,
      moveBottom: this.moveBottom
    }
  },
  watch: {
    currentElement: {
      deep: true,
      handler (val, oldVal, diff) {
        if (this.currentElement) {
          this.currentElement.style = getElementStyle(this.currentElement, this.device)
        }
      }
    },
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
          this.error = '文件最大为' + this.ctx.upload.maxSize
          return
        }
        const image = new Image()
        image.onload = function () {
          builder.insertSVG(this.src, this.width, this.height)
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
    insertText () {
      const clonedElement = clone(TEXT)
      clonedElement.id = shortid()
      clonedElement.visible = true
      clonedElement.text = '请输入文本内容'
      clonedElement.size.width = '50vw'
      clonedElement.size.height = '30px'
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
    insertSVG (url, width, height) {
      const clonedElement = clone(SVG)
      clonedElement.name = '矢量图'
      clonedElement.visible = true
      clonedElement.position.horizontal = 'left'
      clonedElement.position.vertical = 'top'
      clonedElement.size.width = '20vw'
      clonedElement.size.height = Math.floor(20 / width * height) + 'vw'
      clonedElement.url = url
      const style = getElementStyle(clonedElement, this.device)
      clonedElement.style = style
      this.currentScene.elements.push(clonedElement)
      this.currentElement = clonedElement
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
      // 选择的就是当前元素、忽略
      if (this.currentElement && element && this.currentElement.id === element.id) {
        return
      }
      // 销毁现有推拽
      if (this.currentElement) {
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
          this.$nextTick(() => {
            interactElement(document.getElementById('element-' + element.id), element, this)
          })
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
    
    },
    
    moveDown () {
    
    },
    
    moveTop () {
    
    },
    
    moveBottom () {
    
    },

    reflow () {
      for (let scene of this.work.scenes) {
        for (let element of scene.elements) {
          if (element.imgPath) {
            element.url = this.ctx.IMG_SERVER + '/' + element.imgPath
          }
          element.style = getElementStyle(element, this.device)
        }
        scene.style = getSceneStyle(scene, this.device)
      }
    }
  }
}
