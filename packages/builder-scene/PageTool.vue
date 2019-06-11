<template>
<div id="scene-builder">
  <nav-bar></nav-bar>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-full-mobile">
          <div class="level is-mobile">
            <div class="level-left">
              <drop-down-menu :menus="addElementType" @menu-clicked="addMenuClicked">
                <span class="button icon-plus is-small">增加</span>
              </drop-down-menu>
            </div>
            <div class="level-right">
              <a class="button is-primary is-small" @click="savePage">
                <span class="icon">
                  <i class="icon-ok is-small"></i>
                </span>
                <span>保存</span>
              </a>
              <a class="button is-success is-small" @click="play">
                <span>运行</span>
              </a>
            </div>
          </div>
          <div id="stylePreview" @click.self="sceneClick">
            <div class="device" :style="deviceStyle" @click.self="sceneClick">
              <div v-for="element of elements" :key="element.id"
                   class="element" :class="[element===currentElement? 'current': '', element.visible?'':'hidden']" :style="element.style"
                   @click.self="chooseElement(element)">
                <!--<textarea autoHeight="true" :style="{fontSize: '1em', color: element.font.color}" v-if="element.type === TypeEnum.TEXT && element===currentElement" v-css-model="element.text"></textarea>-->
                <span @click.self="chooseElement(element)" @input="contentChange" :contenteditable="element===currentElement" v-if="element.type === TypeEnum.TEXT /*&& element!==currentElement*/" v-html="$options.filters.newline(element.text)"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-one-third-widescreen is-one-third-fullhd is-two-fifths-tablet is-full-mobile">
          <div class="tabs is-small config-tabs">
            <ul>
              <li :class="currentTab===0?'is-active':''"><a @click="setTab(0)">元素配置</a></li>
              <li :class="currentTab===1?'is-active':''"><a @click="setTab(1)">列表</a></li>
              <li :class="currentTab===2?'is-active':''"><a @click="setTab(2)">批量配置{{multipleElementsIndicator}}</a></li>
            </ul>
          </div>
          <prop-config v-if="currentTab===0" :element="currentElement"></prop-config>
          <element-list-config v-if="currentTab===1" :elements="elements" :scene="scene" :device="device"
            @choose="chooseElement"
            @clone="cloneElement"></element-list-config>
          <multi-element-config v-if="currentTab===2"
            :elements="multipleElements"
            :device="device"></multi-element-config>
        </div>
      </div>
    </div>
  </div>
  <image-cropper ref="cropper" @complete="cropComplete" :ratio="previewRatio"></image-cropper>
  <preview-dialog ref="previewDialog"></preview-dialog>
</div>
</template>

<script>
import mixinLoginRequired from '../user/guardLoginRequired'
import ElementListConfig from './tabs/ElementListConfig.vue'
import { clone } from '../utils/object'
import NavBar from '../common/site/NavBar'
import PropConfig from './tabs/PropConfig.vue'
import { IMAGE, SHAPE, TEXT, TypeEnum } from '../danke-core/elements/index'
import TPL_BACKGROUND from '../danke-core/css-model/background.js'
import { getElementStyle, getPositionSizingStyle, getSceneStyle } from '../danke-core/utils/styles'
import { getLength, getLengthDelta } from '../danke-core/utils/common.js'
import ImageCropper from './components/ImageCropper.vue'
import DropDownMenu from '../common/components/DropDownMenu'
import ImageDAO from '../common/dao/imagedao'
import RestDAO from '../common/dao/restdao'
import { Loading, Message, Dialog } from 'element-ui'
import MultiElementConfig from './tabs/MultiElementConfig'
import PagePlay from './PagePlay'
import PreviewDialog from './PreviewDialog'
import { fitToContainer } from '../danke-core/utils/common'

export default {
	name: 'StyleTool',
	components: {
    PreviewDialog,
    PagePlay, MultiElementConfig, DropDownMenu, ImageCropper, PropConfig, NavBar, ElementListConfig, Dialog},
	mixins: [ mixinLoginRequired ],
	data () {
		const background = clone(TPL_BACKGROUND)
		background.size = 40
		return {
      TypeEnum,
		  inc: 1,
			maskStyle: '',
			cornerPosition: {},
			currentElement: null,
			elements: [],
			scene: {
				name: '我的场景',
				background
			},
      currentTab: 1,
      resources: {}
		}
	},
	created () {
	  this.imagedao = new ImageDAO(this.ctx)
		this.scenedao = new RestDAO(this.ctx, 'danke/scene')
		this.ctx.crop = (file, callback) => {
	    this.croppingFileName = file.name
			this.$refs.cropper.open(URL.createObjectURL(file))
			this.$refs.cropper.cropCompleteCallback = callback
		}
		if (this.$route.params.id !== 'new') {
		  this.loadScene(this.$route.params.id)
    }
	},
	computed: {
    multipleElements () {
      const elements = []
      for (let element of this.elements) {
        if (element.checked) {
          elements.push(element)
        }
      }
      return elements
    },
    multipleElementsIndicator () {
      if (this.multipleElements.length) {
        return `(${this.multipleElements.length})`
      } else {
        return ``
      }
    },
    previewRatio () {
      return this.$route.params.screen
		},
    addElementType () {
      return [{
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
    },
		currentStyle () {
			const style = getElementStyle(this.currentElement, this.device)
			this.maskStyle = getPositionSizingStyle(this.currentElement, this.device)
			this.currentElement.style = style
			return style
		},

		deviceStyle () {
			return getSceneStyle(this.scene, this.device)
		},

		containerSize () {
			if (window.innerWidth > 768) {
				return {
					width: 800,
					height: 600
				}
			} else {
				return {
					width: window.innerWidth,
					height: window.innerWidth - 20
				}
			}
		},
		device () {
      return fitToContainer(this.previewRatio, this.containerSize.width, this.containerSize.height)
		}
	},

  watch: {
	  currentElement: {
	    deep: true,
      handler () {
	      this.currentElement.style = getElementStyle(this.currentElement, this.device)
      }
    }
  },

  filters: {
    newline (v) {
      return v.replace(/\n/g, '<br>')
    }
  },

	methods: {
    setTab (index) {
      this.currentTab = index
    },
    addMenuClicked (menu, event) {
      if (menu.type === 'file') {
        this.fileChoosed(event)
      } else if (menu.label === '文字') {
        this.addText()
      } else if (menu.label === '形状') {
        this.addShape()
      }
    },

    addShape () {
      const clonedElement = clone(SHAPE)
      clonedElement.visible = true
      clonedElement.style = getElementStyle(clonedElement, this.device)
      this.inc ++
      this.elements.push(clonedElement)
      this.currentElement = clonedElement
    },

		addText () {
      const clonedElement = clone(TEXT)
      clonedElement.visible = true
      clonedElement.text = '请输入文本内容'
      clonedElement.size.width = '80vw'
      clonedElement.size.height = '0px'
      clonedElement.style = getElementStyle(clonedElement, this.device)
      this.inc ++
      this.elements.push(clonedElement)
      this.currentElement = clonedElement
		},

    cropComplete (croppedList, cropScreenSize) {
      for (let {blob, cropbox} of croppedList) {
        const clonedElement = clone(IMAGE)
        clonedElement.visible = true
        clonedElement.size.width = Math.floor(100 * cropbox.width / cropScreenSize.width) + 'vw'
        clonedElement.size.height = Math.floor(100 * cropbox.height / cropScreenSize.height) + 'vh'
        clonedElement.position.horizontal = 'left'
        clonedElement.position.vertical = 'top'
        clonedElement.position.offsetX = Math.floor(100 * cropbox.left / cropScreenSize.width) + 'vw'
        clonedElement.position.offsetY = Math.floor(100 * cropbox.top / cropScreenSize.height) + 'vh'
        clonedElement.url = URL.createObjectURL(blob)
        const style = getElementStyle(clonedElement, this.device)
        clonedElement.style = style

        this.elements.push(clonedElement)
        blob.filename = this.croppingFileName
        this.resources[clonedElement.url] = blob
      }
    },

		fileChoosed (e) {
			if (e.currentTarget.files.length) {
				const file = e.currentTarget.files[0]
				if (file.size > this.ctx.upload.maxSize) {
					this.error = '文件最大为' + this.ctx.upload.maxSize
				}
				this.ctx.crop(file, this.cropComplete)
				e.currentTarget.value = ''
			}
		},

		sceneClick () {
      this.chooseElement(null)
		},

    moveUp (elements) {

    },

		play () {
			this.$refs.previewDialog.show(clone(this.elements), this.previewRatio)
		},

		chooseElement (element) {
      // save cache of content editable text
      if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.editedText) {
        this.currentElement.text = this.editedText
        this.editedText = null
      }
      if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.currentElement.text === '') {
        this.currentElement.text === ' '
      }
			this.currentElement = element
    },

    cloneElement (element) {
      if (this.currentElement) {
        const clonedElement = clone(this.currentElement)
        clonedElement.visible = true
        clonedElement.position.offsetX = getLengthDelta(clonedElement.position.offsetX, 5)
        clonedElement.position.offsetY = getLengthDelta(clonedElement.position.offsetY, 5)
        this.inc ++
        this.elements.push(clonedElement)
        this.currentElement = clonedElement
      }
    },

    contentChange (e) {
      this.editedText = e.target.innerHTML.replace(/<br>/g, '\n')
    },

		// extract scene info
		getSceneConfig () {
      const elements = []
      for (let element of this.elements) {
        let cloned = clone(element)
        delete cloned.style
        elements.push(cloned)
      }
			return {
				name: this.scene.name,
        screen: this.$route.params.screen,
				background: this.scene.background,
				elements: elements
			}
		},

    async loadScene (id) {
      const scene = await this.scenedao.getOne(id)
      for (let element of scene.elements) {
        if (element.type === TypeEnum.IMAGE && element.url.indexOf('http') === -1) {
          element.url = 'http://image.danke.fun' + element.url
        }
        element.visible = true
      }
      this.scene = {
        name: scene.name,
        background: scene.background
      }
      for (let element of scene.elements) {
        element.style = getElementStyle(element, this.device)
        element.checked = false
      }
      this.elements = scene.elements
    },

    async savePage () {
      const loading = Loading.service({
        lock: true,
        text: '正在保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.4)'
      })

      await this.saveImages()
      const scene = this.getSceneConfig()
      if (this.$route.params.id === 'new') {
        await this.scenedao.create(scene)
      } else {
        await this.scenedao.patch(this.$route.params.id, scene)
      }
      loading.close()

      Message.success('保存完成')
    },

    async saveImages () {
      for (let url in this.resources) {
        const result = await this.imagedao.uploadBlob(this.resources[url])
        for (let element of this.elements) {
          if (element.url === url) {
            element.url = result.url.replace(/http[s]*:\/\/[^/]+/g, '')
          }
        }
      }
    }
	}
}
</script>

<style lang="scss">
#scene-builder {
  .panel {
    margin-bottom: 0;
  }
  .section {
    padding: 1rem;
  }
  .field:not(:last-child) {
    height: 2rem;
    margin-bottom: .5rem;
  }
  .field:last-child {
    height: 2rem;
    margin-bottom: .5rem;
  }
  .level {
    margin-bottom: .5rem!important;
  }
  #stylePreview {
    position: relative;
    display: flex;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    overflow: hidden;
    padding: 2rem 0;
    background: #fafafa;
    .device {
      background-color: #fff;
      border: 1px solid #efefef;
      position: relative;
      .element.current {
        outline: 2px dashed #87b1f1;
        outline-offset: 0;
        z-index: 9999;
      }
      .element.hidden {
        display: none;
      }
      .element {
        span {
          min-height: 12px;
          display: inline-block;
          min-width: 50px;
        }
      }
    }
    $pointWidth: 12px;
  }
  .toolbar {
    position: absolute;
    top: 1em;
    width: 100%;
  }

  .config-tabs {
    margin-bottom: .8rem;
  }
  .f-left {
    float: left;
  }
  .f-right {
    float: right;
  }
  @media screen and (max-width: 768px) {
    #stylePreview {
      height: 100vw;
    }
  }
}



</style>
