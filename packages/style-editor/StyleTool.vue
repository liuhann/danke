<template>
<div>
	<nav-bar></nav-bar>
	<div class="columns is-mobile is-multiline" style="margin: 5px;">
		<div class="column is-full-mobile" id="stylePreview">
			<div class="columns toolbar">
				<div class="column">
					<div class="columns">
						<div class="column">
							<div class="buttons has-addons">
								<span class="button is-small" v-for="ratio of ratios" :key="ratio.ratio" :class="previewRatio === ratio.ratio? 'is-selected is-info': ''" @click="previewRatio = ratio.ratio">{{ratio.ratio}}</span>
							</div>
						</div>
						<div class="column">
							<div class="buttons has-addons">
								<span class="button icon-mobile is-small" :class="vertical? 'is-selected is-info': ''" @click="vertical = true"></span>
								<span class="button icon-laptop is-small" :class="vertical? '': 'is-selected is-info'" @click="vertical = false"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="column">
					<div class="buttons has-addons is-right">
						<span class="button icon-floppy" @click="share"></span>
					</div>
				</div>
			</div>
			<div class="device" :style="deviceStyle"></div>
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
      deviceStyle () {

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

<style>
#stylePreview {
	position: relative;
	display: flex;
	justify-content: center;
	-webkit-box-align: center;
	align-items: center;
	height: calc(100vh - 4rem);
}
.toolbar {
	position: absolute;
	top: 1em;
	width: 100%;
}


@media screen and (max-width: 768px) {
	#stylePreview {
		height: 100vw;
	}
}


</style>
