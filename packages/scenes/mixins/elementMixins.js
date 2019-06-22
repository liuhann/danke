import { IMAGE, SHAPE, TEXT, TypeEnum } from '../../danke-core/elements/index'
import { clone } from '../../utils/object'
import { getElementStyle } from '../../danke-core/utils/styles'
import { interactElement } from './interact'
import { shortid } from '../../utils/string'
const addElementType = [{
  type: 'file',
  label: '图片',
  icon: 'icon-picture'
}, {
  label: '形状',
  icon: 'icon-popup'
}, {
  label: '文字',
  icon: 'icon-sort-alphabet'
}]

export default {
  data () {
    return {
      addElementType,
      elements: [],
      resources: {},
      currentElement: null
    }
  },
  watch: {
    currentElement: {
      deep: true,
      handler () {
        if (this.currentElement) {
          this.currentElement.style = getElementStyle(this.currentElement, this.device)
        }
      }
    }
  },
  filters: {
    newline (v) {
      return v.replace(/\n/g, '<br>')
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
    insertShape () {
      const clonedElement = clone(SHAPE)
      clonedElement.id = shortid()
      clonedElement.visible = true
      clonedElement.style = getElementStyle(clonedElement, this.device)
      this.inc++
      this.elements.push(clonedElement)
      this.currentElement = clonedElement
      this.elementMounted([clonedElement])
    },
    insertText () {
      const clonedElement = clone(TEXT)
      clonedElement.id = shortid()
      clonedElement.visible = true
      clonedElement.text = '请输入文本内容'
      clonedElement.size.width = '80vw'
      clonedElement.size.height = '0px'
      clonedElement.style = getElementStyle(clonedElement, this.device)
      this.inc++
      this.elements.push(clonedElement)
      this.currentElement = clonedElement
      this.elementMounted([clonedElement])
    },
    insertImage (croppedList, cropScreenSize) {
      const elements = []
      for (let { blob, cropbox } of croppedList) {
        const clonedElement = clone(IMAGE)
        clonedElement.id = shortid()
        clonedElement.visible = true
        clonedElement.position.horizontal = 'left'
        clonedElement.position.vertical = 'top'
        const sizeWidth = Math.floor(100 * cropbox.width / cropScreenSize.width)
        const sizeHeight = Math.floor(100 * cropbox.height / cropScreenSize.height)
        clonedElement.size.width = (sizeWidth > 100 ? 100 : sizeWidth) + 'vw'
        clonedElement.size.height = (sizeHeight > 100 ? 100 : sizeHeight) + 'vh'
        clonedElement.position.offsetX = Math.floor(100 * cropbox.left || 0 / cropScreenSize.width) + 'vw'
        clonedElement.position.offsetY = Math.floor(100 * cropbox.top || 0 / cropScreenSize.height) + 'vh'
        clonedElement.url = URL.createObjectURL(blob)
        const style = getElementStyle(clonedElement, this.device)
        clonedElement.style = style
        this.elements.push(clonedElement)
        elements.push(clonedElement)
        blob.filename = this.croppingFileName
        this.resources[clonedElement.url] = blob
      }
      this.elementMounted(elements)
    },

    elementMounted (elements) {
      this.$nextTick(() => {
        for (const element of elements) {
          interactElement(document.getElementById('element-' + element.id), element, this)
        }
      })
    },

    chooseElement (element) {
      // save cache of content editable text
      if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.editedText) {
        this.currentElement.text = this.editedText
        this.editedText = null
      }
      if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.currentElement.text === '') {
        this.currentElement.text = ' '
      }
      this.currentElement = element
    },
    reflow () {
      for (let element of this.elements) {
        element.style = getElementStyle(element, this.device)
      }
    }
  }
}
