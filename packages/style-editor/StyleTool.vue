<template>
<div>
	<nav-bar></nav-bar>
	<div class="columns is-mobile is-multiline" style="margin: 5px;">
		<div class="column is-full-mobile">
			<div class="columns toolbar">
				<div class="column">
					<div class="buttons has-addons">
						<span class="button" v-for="ratio of ratios" :key="ratio.ratio" :class="previewRatio === ratio.ratio? 'is-selected is-info': ''" @click="previewRatio = ratio.ratio">{{ratio.ratio}}</span>
					</div>
				</div>
				<div class="column">
					<div class="buttons has-addons is-right">
						<span class="button icon-floppy" @click="share"></span>
					</div>
				</div>
			</div>
		</div>
		<div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">
			<prop-config :element="element" fontable @file-add="fileAdded" @file-remove="fileRemoved"></prop-config>
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
        ratios
			}
		}
  }
</script>

<style scoped>

</style>