<template>
<div>
	<nav-bar></nav-bar>
	<div class="columns is-mobile is-multiline" style="margin: 5px;">
		<div class="column is-full-mobile">
			<!--operation level-->
			<div class="level is-mobile">
				<div class="level-left">
					<div class="buttons has-addons">
						<span class="button" v-for="ratio of ratios" :key="ratio.ratio" :class="previewRatio === ratio.ratio? 'is-selected is-info ' + ratio.icon : ratio.icon" @click="previewRatio = ratio.ratio"></span>
					</div>
				</div>
				<div class="level-right">
					<div class="buttons has-addons">
						<div class="file">
							<label class="file-label">
								<input class="file-input" type="file" name="resume"  @input="fileChoosed">
								<span class="button icon-picture">
    						</span>
							</label>
						</div>
						<span class="button icon-font" @click="addText"></span>
						<span v-if="!isPlaying" class="button icon-play" @click="play"></span>
						<span v-if="isPlaying" class="button icon-stop" @click="stop"></span>
					</div>
				</div>
			</div>
			<!--preview-->
			<div id="stylePreview">
				<div class="device" :style="{width: device.width + 'px', height: device.height + 'px'}" @click.self="sceneClick">
					<div v-for="element of elements" :key="element.id" 
						class="element" :style="element===currentElement? currentStyle: element.style"
					  @click="chooseElement(element)">{{element.text}}</div>
					<!-- resize and dragging -->
				</div>
			</div>
		</div>
		<div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">
			<prop-config v-if="currentElement" :element="currentElement" :animations="[]"
				fontable @file-add="fileAdded" @file-remove="fileRemoved"></prop-config>
			<scene-config v-if="!currentElement" :elements="elements"></scene-config>
		</div>
	</div>
	<image-cropper ref="cropper" @complete="cropComplete"></image-cropper>
</div>
</template>

<script>
import SceneConfig from './components/SceneConfig.vue'
import { clone } from '../utils/object'
import NavBar from '../common/NavBar'
import PropConfig from './components/PropConfig.vue'
import ELEMENT_TPL, { simplify } from './model/element'
import { getElementStyle, getPositionSizingStyle, getLength } from './utils/styles'
import ImageCropper from './components/ImageCropper.vue'
const ratios = [{
	ratio: '9:16',
	icon: 'icon-mobile'
}, {
	ratio: '16:9',
	icon: 'icon-laptop'
}, {
	ratio: '4:3',
	icon: 'icon-address-card-o'
}]
export default {
	name: 'StyleTool',
	components: {ImageCropper, PropConfig, NavBar, SceneConfig},
	mixins: [],
	data () {
		return {
			previewRatio: '9:16',
			cornerPosition: {},
			ratios,
			currentElement: null,
			isPlaying: false,
			elements: []
		}
	},
	created () {
		// if (this.elements.length === 0) {
			//  this.addElement()
			//  this.updateMaskPosition()
		// }
	},
	computed: {
		currentStyle () {
			const style = getElementStyle(this.currentElement, this.device)
			this.currentElement.style = style
			return style
		},
		containerSize () {
			if (screen.width > 768) {
				return {
					width: window.innerWidth / 5 * 3,
					height: window.innerHeight - 150
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
		addText () {

		},

		fileChoosed (e) {
			if (e.currentTarget.files.length) {
				const file = e.currentTarget.files[0]
				if (file.size > this.ctx.upload.maxSize) {
					this.error = '文件最大为' + this.ctx.upload.maxSize
				}
				this.$refs.cropper.open(URL.createObjectURL(file))
			}
		},

		updateMaskPosition () {
			this.cornerPosition = {
				left: getLength(this.currentElement.size.width, this.device) - 12 + 'px',
				top: getLength(this.currentElement.size.height, this.device) - 12 + 'px'
			}
			this.maskStyle = getPositionSizingStyle(this.currentElement, this.device)
			console.log('update mask', this.cornerPosition, this.maskStyle)
		},

		sceneClick () {

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
			this.elements.push(clonedElement)
			this.currentElement = clonedElement
		},

		share () {

		},
		fileAdded () {

		},
		fileRemoved () {

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
	.device {
		background-color: rgba(0, 0, 0, .3);
		position: relative;
	}
	$pointWidth: 12px;
	.draggabily {
		border: 2px solid #00d1b2;
		position: relative;
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
		.lt {
			left: -$pointWidth/2;
			top: -$pointWidth/2;
		}
		.rt {
			right: -$pointWidth/2;
			top: -$pointWidth/2;
		}
		.lb {
			left: -$pointWidth/2;
			bottom: -$pointWidth/2;
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
