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
						<span class="button icon-play" @click="play"></span>
						<span class="button icon-floppy" @click="share"></span>
					</div>
				</div>
			</div>
			<div id="stylePreview">
				<div class="device" :style="{width: device.width + 'px', height: device.height + 'px'}">
					<div v-for="element of elements" class="element" :style="element===currentElement? currentStyle: element.style">{{element.text}}</div>
					<div v-if="currentElement" class="draggabily" :style="maskStyle">
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
				elements: []
			}
		},
		created () {
      if (this.elements.length === 0) {
        this.currentElement = this.addElement()
			}
		},
		computed: {
      currentStyle () {
				const style = getElementStyle(this.currentElement, this.device)
				this.currentElement.style = style
				return style
			},
      maskStyle () {
        const maskStyle = getPositionSizingStyle(this.currentElement, this.device)
				return maskStyle
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
				cloned.elementStyle = getElementStyle(cloned, this.device)
				this.cornerPosition = {
          left: getLength(cloned.size.width, this.device) + 'px',
          top: getLength(cloned.size.height, this.device) + 'px'
				}
				return cloned
			},

			play () {

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
		overflow: hidden;
		position: relative;
	}
	$pointWidth: 12px;
	.draggabily {
		border: 1px dashed #404040;
		position: relative;
		z-index: 10001;
		>div {
			position: absolute;
			width: $pointWidth;
			height: $pointWidth;
			background-color: #00d1b2;
			border-radius: $pointWidth;
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
