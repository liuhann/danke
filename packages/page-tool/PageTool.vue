<template>
<div>
  <nav-bar></nav-bar>
  <div class="columns is-mobile is-multiline" style="margin: 5px;">
    <div class="column is-full-mobile">
      <!--operation level-->
      <div class="level is-mobile">
        <div class="level-left">
          <drop-down-menu :menus="addElementType" @menu-clicked="addMenuClicked">
            <span class="button icon-plus">增加</span>
          </drop-down-menu>
        </div>
        <div class="level-right">
          <a class="button is-primary" @click="savePage">
            <span class="icon">
              <i class="icon-floppy"></i>
            </span>
            <span>保存</span>
          </a>
        </div>
      </div>
      <!--preview-->
      <div id="stylePreview" @click.self="sceneClick">
        <div class="device" :style="deviceStyle" @click.self="sceneClick">
          <div v-for="element of elements" :key="element.id"
            class="element" :style="element===currentElement? currentStyle: element.style"
            @click.self="chooseElement(element)">{{element.text}}</div>
          <!-- resize and dragging -->
          <div class="draggabily" v-if="currentElement" :style="maskStyle">&nbsp;</div>
        </div>
      </div>
    </div>
    <div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">
      <prop-config v-if="currentElement" :element="currentElement"
        @remove="removeCurrentElement"></prop-config>
      <scene-config v-if="!currentElement" :elements="elements" :scene="scene" @choose="chooseElement"></scene-config>
    </div>
  </div>
  <image-cropper ref="cropper" @complete="cropComplete"></image-cropper>
</div>
</template>

<script>
import './fontello/css/fontello.css'
import mixinLoginRequired from '../user/guardLoginRequired'
import SceneConfig from './components/SceneConfig.vue'
import { clone } from '../utils/object'
import NavBar from '../common/site/NavBar'
import PropConfig from './components/PropConfig.vue'
import ELEMENT_TPL, { simplify, TypeEnum } from '../danke-core/model/element'
import TPL_BACKGROUND from '../danke-core/model/background.js'
import { getElementStyle, getPositionSizingStyle, getLength, getSceneStyle } from '../danke-core/utils/styles'
import ImageCropper from './components/ImageCropper.vue'
import DropDownMenu from '../common/components/DropDownMenu'
import ImageDAO from '../common/dao/imagedao'
import RestDAO from '../common/dao/restdao'
export default {
	name: 'StyleTool',
	components: {DropDownMenu, ImageCropper, PropConfig, NavBar, SceneConfig},
	mixins: [ mixinLoginRequired ],
	data () {
		const background = clone(TPL_BACKGROUND)
		background.size = 40
		return {
		  inc: 1,
			maskStyle: '',
			cornerPosition: {},
			currentElement: null,
			isPlaying: false,
			elements: [],
			scene: {
				name: '我的场景',
				background
			},
      resources: {}
		}
	},
	created () {
	  this.imagedao = new ImageDAO(this.ctx)
		this.scenedao = new RestDAO(this.ctx, 'scenes')
		this.ctx.crop = (file, callback) => {
	    debugger
	    this.croppingFileName = file.name
			this.$refs.cropper.open(URL.createObjectURL(file))
			this.$refs.cropper.cropCompleteCallback = callback
		}
	},
	computed: {
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
        icon: 'icon-mobile'
      }, {
        label: '文字',
        icon: 'icon-font'
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
			if (screen.width > 768) {
				return {
					width: window.innerWidth / 5 * 3,
					height: window.innerHeight - 100
				}
			} else {
				return {
					width: window.innerWidth,
					height: window.innerWidth - 20
				}
			}
		},
		device () {
			let [w, h] = this.previewRatio.split(':')
			let rw = parseInt(w)
			let rh = parseInt(h)
			const width1 = this.containerSize.width
			const height1 = width1 / rw * rh
			if (height1 > this.containerSize.height) {
				const height2 = this.containerSize.height
				const width2 = this.containerSize.height / rh * rw
				return {
					width: Math.floor(width2),
					height: Math.floor(height2)
				}
			} else {
				return {
					width: Math.floor(width1),
					height: Math.floor(height1)
				}
			}
		}
	},
	methods: {
    addMenuClicked (menu, event) {
      if (menu.type === 'file') {
        this.fileChoosed(event)
      } else if (menu.label === '文字') {
        this.addText()
      }
    },
		addText () {
      const clonedElement = clone(ELEMENT_TPL)
      clonedElement.text = '请输入文本内容'
      clonedElement.type = TypeEnum.TEXT
      clonedElement.name = '文本' + this.inc
      clonedElement.size.width = '80vw'
      this.inc ++
      this.elements.push(clonedElement)
      this.currentElement = clonedElement
		},

    cropComplete (blob, cropbox) {
      const clonedElement = clone(ELEMENT_TPL)
      const wider = (cropbox.width / cropbox.height) > (this.device.width / this.device.height)
      if (wider) { // 宽度优先
        if (cropbox.width > this.device.width) {
          clonedElement.size.width = '100vw'
          clonedElement.size.height =  Math.floor((cropbox.height / cropbox.width) * 100) + 'vw'
        } else {
          clonedElement.size.width = Math.floor(100 * cropbox.width/this.device.width) + 'vw'
          clonedElement.size.height = Math.floor(100 * cropbox.height/this.device.width) + 'vw'
        }
      } else { // 高度优先
        if (cropbox.height > this.device.height) {
          clonedElement.size.height = '100vh'
          clonedElement.size.width =  Math.floor((cropbox.width / cropbox.height) * 100) + 'vh'
        } else {
          clonedElement.size.width = Math.floor(100 * cropbox.width/this.device.height) + 'vh'
          clonedElement.size.height = Math.floor(100 * cropbox.height/this.device.height) + 'vh'
        }
      }
      clonedElement.size.fix = true
      clonedElement.url = URL.createObjectURL(blob)
      clonedElement.name = '图片' + this.inc
      clonedElement.type = TypeEnum.IMAGE
      this.inc ++
      this.elements.push(clonedElement)
      this.currentElement = clonedElement
      blob.filename = this.croppingFileName
      this.resources[clonedElement.url] = blob
    },

		removeCurrentElement () {
			for (let i = 0; i < this.elements.length; i++) {
				if (this.elements[i] === this.currentElement) {
					this.elements.splice(i, 1)
          if (this.currentElement.url) {
            this.resources[url] = null
					  delete this.resources[url]
          }
					break
				}
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
			this.currentElement = null
		},

		play () {
			this.currentElement = null
			const clonedElements = clone(this.elements)
			this.elements = []
			this.$nextTick( () => {
				for (let element of clonedElements) {
					element.style = getElementStyle(element, this.device, 'in')
					this.elements = clonedElements
				}
			}, 20)
			this.isPlaying = true
		},

		chooseElement (element) {
			this.currentElement = element
		},

		stop () {
			this.isPlaying = false
		},

		finish () {
			for (let element of clonedElements) {
				element.style = getElementStyle(element, this.device, 'out')
				this.elements = clonedElements
			}
		},

		// extract scene info
		getSceneConfig () {
			return {
				name: this.scene.name,
				background: this.scene.background,
				elements: this.elements
			}
		},

    async savePage () {
      await this.saveImages()
    },

    async saveImages () {
      for (let url in this.resources) {
        const result = await this.imagedao.uploadBlob(this.resources[url])
        for (let element of this.elements) {
          if (element.url === url) {
            element.url = result.url
          }
        }
      }
      if (this.$route.params.id === 'new') {
				this.scenedao.create(this.getSceneConfig())
			} else {
				this.scenedao.update(this.$route.params.id, this.getSceneConfig())
			}
    }
	}
}
</script>

<style lang="scss">
#stylePreview {
	position: relative;
	display: flex;
	justify-content: center;
	-webkit-box-align: center;
	align-items: center;
	height: calc(100vh - 10rem);
  margin-top: -1.5rem;
	.device {
		background-color: rgba(0, 0, 0, .3);
		position: relative;
	}
	$pointWidth: 12px;
	.draggabily {
		box-shadow: 0px 0px 0px 3px #0384da;
		// border: 2px outset #209cee;
		z-index: 999;
		.handler {
			position: absolute;
			height: 24px;
			width: 24px;
			font-size: 20px;
			color: rgba(0, 0, 0, .8);
			text-align: center;
			margin: -12px 0 0 -12px;
			left: 50%;
			top: 50%;
			cursor: pointer;
		}
		.corner-point {
			cursor: nw-resize;
			position: absolute;
			width: $pointWidth;
			height: $pointWidth;
			background-color: rgba(0, 0, 0, .8);
		}
	}
}
.toolbar {
	position: absolute;
	top: 1em;
	width: 100%;
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


</style>
