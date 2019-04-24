<template>
<div>
	<nav-bar></nav-bar>
	<div class="columns is-mobile is-multiline" style="margin: 5px;">
		<div class="column is-full-mobile">
			<div class="level is-mobile">
				<div class="level-left">
					<div class="buttons has-addons">
						<span class="button" v-for="ratio of ratios" :key="ratio.ratio" :class="previewRatio === ratio.ratio? 'is-selected is-info ' + ratio.icon : ratio.icon" @click="previewRatio = ratio.ratio"></span>
					</div>
				</div>
				<div class="level-right">
					<div class="buttons has-addons f-right">
						<span class="button icon-plus" @click="addElement"></span>
						<span v-if="!isPlaying" class="button icon-play" @click="play"></span>
						<span v-if="isPlaying" class="button icon-stop" @click="stop"></span>
						<span v-if="isPlaying" class="button icon-to-end" @click="finish"></span>
						<span class="button icon-floppy" @click="share"></span>
					</div>
				</div>
			</div>
			<div id="stylePreview">
				<div class="device" :style="{width: device.width + 'px', height: device.height + 'px'}" @click.self="sceneClick">
					<div v-for="element of elements" class="element" :style="element===currentElement? currentStyle: element.style"
					  @click="currentElement = element">{{element.text}}</div>
					<div v-if="currentElement" ref="draggabily" class="draggabily" :style="maskStyle">
						<div class="handler"><span class="icon-menu"></span></div>
						<div class="rb corner-point" :style="cornerPosition"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">
			<prop-config v-if="currentElement" :element="currentElement" :animations="[]"
				fontable @file-add="fileAdded" @file-remove="fileRemoved"></prop-config>
		</div>
	</div>
</div>
</template>

<script>
	import { clone } from '../utils/object'
  import NavBar from '../common/NavBar'
  import PropConfig from './components/PropConfig'
  import ELEMENT_TPL, { simplify } from './model/element'
	import SizingMixin from './components/SizingMixins'
  import { getElementStyle, getPositionSizingStyle, getLength } from './utils/styles'
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
    components: {PropConfig, NavBar},
		mixins: [SizingMixin],
		data () {
      return {
        previewRatio: '9:16',
        ratios,
        currentElement: null,
        isPlaying: false,
				elements: []
			}
		},
		created () {
      if (this.elements.length === 0) {
        this.addElement()
        this.updateMaskPosition()
			}
		},
		computed: {
      currentStyle () {
				const style = getElementStyle(this.currentElement, this.device)
				if (!this.draggingRect) {
          this.updateMaskPosition()
				}
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
            width: width2,
						height: height2
					}
        } else {
          return {
            width: width1,
            height: height1
          }
				}
			}
		},
		methods: {
      addElement () {
        const cloned = clone(ELEMENT_TPL)
				this.elements.push(cloned)
				cloned.style = getElementStyle(cloned, this.device)
				this.currentElement = cloned
			},

			updateMaskPosition () {
        this.cornerPosition = {
          left: getLength(this.currentElement.size.width, this.device) - 12 + 'px',
          top: getLength(this.currentElement.size.height, this.device) - 12 + 'px'
        }
        this.maskStyle = getPositionSizingStyle(this.currentElement, this.device)
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

      stop () {
        this.isPlaying = false
      },

      finish () {
				for (let element of clonedElements) {
					element.style = getElementStyle(element, this.device, 'out')
					this.elements = clonedElements
				}
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
		border: 1px dashed #404040;
		position: relative;
		z-index: 10001;
		.handler {
			position: absolute;
			height: 24px;
			width: 24px;
			background-color: rgba(255,255,255, .2);
			color: #00d1b2;
			text-align: center;
			left: 5px;
			top: 5px;
		}
		.corner-point {
			position: absolute;
			width: $pointWidth;
			height: $pointWidth;
			background-color: #00d1b2;
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
