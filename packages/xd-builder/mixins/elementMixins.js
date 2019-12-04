import { IMAGE, SHAPE, TEXT, LAYOUT } from '../../danke-core/elements/index'
import { clone } from '../../utils/object'
import { getElementInnerStyle, getElementStyle, getSceneStyle } from '../../danke-core/utils/styles'
import { shortid } from '../../utils/string'
import { MessageBox, Message } from 'element-ui'
import PaperFolding from '../../danke-plugins/paperfold/paperfolding'
import Flip from '../../danke-plugins/flip/flip'

export default {
  data () {
    return {
      clipboard: {
        elements: [],
        cutFrom: null
      }
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
    cropImage (file) {
      this.croppingFileName = file.name
      this.$refs.cropper.open(file, this.ratio || '16:9')
      this.$refs.cropper.cropCompleteCallback = this.insertImage
    },
    insertLayout (template) {
      const cloned = clone(LAYOUT)
      Object.assign(cloned, template)
      cloned.id = shortid()
      cloned.style = getElementStyle(cloned, this.device)
      this.currentScene.layouts.push(cloned)
      this.chooseElement(cloned)
    },

    /**
     * 插入形状，为了支持边框和阴影， 形状只支持圆形 (椭圆形) 和正方形
     */
    insertShape () {
      const clonedElement = clone(SHAPE)
      clonedElement.id = shortid()
      clonedElement.name = '矩形'
      clonedElement.background.colors = ['#eee']
      clonedElement.size.width = '30vw'
      clonedElement.size.height = '30vw'
      clonedElement.style = getElementStyle(clonedElement, this.device)
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
    },

    /**
    * 设置或插入文本元素  主要供文字输入框弹出时回调
    */
    setElementText (text) {
      if (this.currentElement) {
        this.currentElement.text = text
      } else {
        const clonedElement = clone(TEXT)
        clonedElement.id = shortid()
        clonedElement.visible = true
        clonedElement.text = text
        clonedElement.size.width = '50vw'
        clonedElement.size.height = '40px'
        clonedElement.style = getElementStyle(clonedElement, this.device)
        this.inc++
        this.currentScene.elements.push(clonedElement)
        this.chooseElement(clonedElement)
      }
    },

    /**
    * 调用插入文字Pop
    */
    insertText (text) {
      this.chooseElement(null)
      this.$refs.dialogEditText.open('')
    },

    /**
    * 裁剪后插入图片
    */
    insertCroppedImage (croppedList, cropScreenSize) {
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
        clonedElement.style = getElementStyle(clonedElement, this.device)
        clonedElement.innerStyle = getElementInnerStyle(clonedElement, this.device)
        this.currentScene.elements.push(clonedElement)
        elements.push(clonedElement)
        blob.filename = this.croppingFileName
      }
    },
    /**
     * 插入图片 注意此时图片并不上传，只有保存时才上传并设置element.imgPath属性
     * @param e
     */
    insertRawImage (e) {
      const file = e
      const clonedElement = clone(IMAGE)
      clonedElement.id = shortid()
      clonedElement.name = '图片'
      clonedElement.visible = true
      clonedElement.position.horizontal = 'center'
      clonedElement.position.vertical = 'center'
      clonedElement.border.width = 0
      clonedElement.size.width = '100vw'
      clonedElement.size.height = '100vw'
      clonedElement.url = URL.createObjectURL(file)
      clonedElement.blob = file
      const style = getElementStyle(clonedElement, this.device)
      clonedElement.style = style
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
    },

    /**
     * 插入SVG类型图标
     * @param svgContent
     * @param desc
     */
    insertSVGImage (svgContent, desc) {
      const clonedElement = clone(IMAGE)
      clonedElement.id = shortid()
      clonedElement.name = '矢量图片' + desc
      clonedElement.visible = true
      clonedElement.position.horizontal = 'center'
      clonedElement.position.vertical = 'center'
      clonedElement.border.width = 0
      clonedElement.size.width = '100vw'
      clonedElement.size.height = '100vw'
      clonedElement.svg = svgContent
      let svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
      let url = URL.createObjectURL(svgBlob)
      clonedElement.url = url
      const style = getElementStyle(clonedElement, this.device)
      clonedElement.style = style
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
    },

    /**
    * 插入折纸效果
    */
    insertPaperFolding (e) {
      const file = e.raw
      const clonedElement = clone(PaperFolding)
      clonedElement.id = shortid()
      clonedElement.name = '图片栅格'
      clonedElement.visible = true
      clonedElement.position.horizontal = 'center'
      clonedElement.position.vertical = 'center'
      clonedElement.size.width = '100vw'
      clonedElement.size.height = '100vw'
      clonedElement.url = URL.createObjectURL(file)
      clonedElement.blob = file
      const style = getElementStyle(clonedElement, this.device)
      clonedElement.style = style
      this.currentScene.elements.push(clonedElement)
      this.chooseElement(clonedElement)
    },

    /**
     * 插入插件图片 可翻转图片
     */
    insertFlipImage () {
      const clonedElement = clone(Flip)
      clonedElement.id = shortid()
      clonedElement.name = '图片翻转'
      clonedElement.visible = true
      clonedElement.position.horizontal = 'center'
      clonedElement.position.vertical = 'center'
      clonedElement.size.width = '100vw'
      clonedElement.size.height = '100vw'
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
        const removeTarget = element || this.currentElement
        const targetIndex = this.currentScene.elements.indexOf(removeTarget)
        this.currentScene.elements.splice(targetIndex, 1)
        this.currentElement = null
      })
    },

    contentChange (e) {
      this.editedText = e.target.innerHTML.replace(/<br>/g, '\n')
    },

    /**
     * 选择一个元素， 可以为空
     * @param element
     * @param event
     */
    chooseElement (element) {
      this.elementChoosed && this.elementChoosed()
      // 选择的就是当前元素、忽略
      if (this.currentElement && element && this.currentElement.id === element.id) {
        return
      }
      this.currentElement = element
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

    /**
    * 调整元素Z坐标
    */
    moveElementZ (z) {
      if (z === 'up') {
        this.moveUp(this.currentElement)
      } else if (z === 'down') {
        this.moveDown(this.currentElement)
      } else if (z === 'top') {
        this.moveTop(this.currentElement)
      } else if (z === 'bottom') {
        this.moveBottom(this.currentElement)
      }
    },
    moveDown (element) {
      const elementIndex = this.currentScene.elements.indexOf(element)
      if (elementIndex === 0) {
        return
      }
      this.$set(this.currentScene.elements, elementIndex, this.currentScene.elements[elementIndex - 1])
      this.$set(this.currentScene.elements, elementIndex - 1, this.currentElement)
    },

    moveUp (element) {
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

    /**
    * 重新计算所有场景、元素的样式及位置信息
    */
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
