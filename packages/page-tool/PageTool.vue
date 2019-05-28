<template>
<div>
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
              <i class="icon-floppy is-small"></i>
            </span>
                <span>保存</span>
              </a>
            </div>
          </div>
          <div id="stylePreview" @click.self="sceneClick">
            <div class="device" :style="deviceStyle" @click.self="sceneClick">
              <div v-for="element of elements" :key="element.id"
                   class="element" :class="element===currentElement? 'current': ''" :style="element===currentElement? currentStyle: element.style"
                   @click.self="chooseElement(element)">
                <!--<textarea autoHeight="true" :style="{fontSize: '1em', color: element.font.color}" v-if="element.type === TypeEnum.TEXT && element===currentElement" v-model="element.text"></textarea>-->
                <span @click.self="chooseElement(element)" @input="contentChange" :contenteditable="element===currentElement" v-if="element.type === TypeEnum.TEXT /*&& element!==currentElement*/" v-html="$options.filters.newline(element.text)"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-one-third-widescreen is-one-quarter-fullhd is-two-fifths-tablet is-full-mobile">
          <prop-config v-if="currentElement" :element="currentElement"
                       @remove="removeCurrentElement"></prop-config>
          <scene-config v-if="!currentElement" :elements="elements" :scene="scene" @choose="chooseElement"></scene-config>
        </div>
      </div>
    </div>
  </div>

  <div class="columns is-mobile is-multiline" style="margin: 5px;">
    <div class="column is-full-mobile">
      <!--operation level-->
      <!--preview-->
    </div>
    <div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">

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
import { Loading, Message } from 'element-ui'
export default {
	name: 'StyleTool',
	components: {DropDownMenu, ImageCropper, PropConfig, NavBar, SceneConfig},
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
        this.addText()
      }
    },
		addText () {
      const clonedElement = clone(ELEMENT_TPL)
      clonedElement.text = '请输入文本内容'
      clonedElement.type = TypeEnum.TEXT
      clonedElement.name = '文本' + this.inc
      clonedElement.size.width = '80vw'
      clonedElement.size.height = '0px'
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
      delete clonedElement.font
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
      this.chooseElement(null)
		},

		play () {
      this.chooseElement(null)
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
      // save cache of content editable text
      if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.editedText) {
        this.currentElement.text = this.editedText
        this.editedText = null
      }
			this.currentElement = element
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
        if (element.url.indexOf('http') === -1) {
          element.url = 'http://image.danke.fun' + element.url
        }
      }
      this.scene = {
        name: scene.name,
        background: scene.background
      }
      this.elements = scene.elements
      for (let element of this.elements) {
        element.style = getElementStyle(element, this.device)
      }
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
html.has-navbar-fixed-top, body.has-navbar-fixed-top {
  padding-top: 0;
}

.section {
  padding: 1rem;
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
      outline: 1px dashed #87b1f1;
      outline-offset: 0;
    }
    textarea {
      width: 100%;
      border: none;
      background: transparent;
      -webkit-appearance: none;
    }
    textarea:focus, input:focus{
      outline: none;
    }
	}
	$pointWidth: 12px;
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
