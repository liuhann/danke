<template>
<div>
	<nav-bar></nav-bar>
	<div class="columns is-mobile is-multiline" style="margin: 5px;">
		<div class="column is-full-mobile" id="stylePreview">
			<div class="toolbar">
					<div class="buttons has-addons f-left">
						<span class="button" v-for="ratio of ratios" :key="ratio.ratio" :class="previewRatio === ratio.ratio? 'is-selected is-info': ''" @click="previewRatio = ratio.ratio">{{ratio.ratio}}</span>
					</div>
					<div class="buttons has-addons f-left" style="margin-left: 5px;">
						<span class="button icon-mobile" :class="vertical? 'is-selected is-info': ''" @click="vertical = true"></span>
						<span class="button icon-laptop" :class="vertical? '': 'is-selected is-info'" @click="vertical = false"></span>
					</div>
					<div class="buttons has-addons f-right">
						<span class="button icon-floppy" @click="share"></span>
					</div>
			</div>
			<div class="device" :style="deviceStyle">
				<div class="element"></div>
			</div>
		</div>
		<div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">
			<prop-config :element="element" :animations="[]" fontable @file-add="fileAdded" @file-remove="fileRemoved"></prop-config>
		</div>
	</div>
</div>
</template>

<script>
	import { clone } from '../utils/object'
	import { ratios } from './build-in'
  import NavBar from '../common/NavBar'
  import PropConfig from './components/PropConfig'
  import template, { simplify } from './model/element'
  export default {
    name: 'StyleTool',
    components: {PropConfig, NavBar},
		data () {
      return {
        element: clone(template),
        previewRatio: '16:9',
        ratios,
				vertical: true
			}
		},
		computed: {
      containerSize () {
        if (screen.width > 768) {
          return {
            width: window.clientWidth / 5 * 3,
						height: window.clientHeight - 150
					}
				} else {
          return {
            width: window.clientWidth,
						height: window.clientWidth* 0.8
					}
				}
			},
      deviceStyle () {
        let [w, h] = this.previewRatio.split(':')
				let rw = parseInt(w)
				let rh = parseInt(h)
				if (this.vertical) {
          rw = parseInt(h)
					rh = parseInt(w)
				}
				const width1 = this.containerSize.width * 0.9
				const height1 = width1 / rw * rh
				if (height1 > this.containerSize.height) {
          const height2 = this.containerSize.height * 0.9
          const width2 = height2 / rh * rw
					return {
            width: width2 + 'px',
						height: height2 + 'px'
					}
        } else {
          return {
            width: width1 + 'px',
            height: height1 + 'px'
          }
				}
			}
		},
		methods: {
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
	height: calc(100vh - 4rem);

	.device {
		background-color: #efefef;
		overflow: hidden;
		position: relative;
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
