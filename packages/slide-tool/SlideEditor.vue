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
			<div id="stylePreview" @click.self="sceneClick">
				<div class="device" :style="{width: device.width + 'px', height: device.height + 'px'}" @click.self="sceneClick">
					<div v-for="element of elements" :key="element.id" 
						class="element" :style="element===currentElement? currentStyle: element.style"
					  @click.self="chooseElement(element)">{{element.text}}</div>
					<!-- resize and dragging -->
					<div class="draggabily" v-if="currentElement" :style="maskStyle"></div>
				</div>
			</div>
		</div>
		<div class="column is-one-third-widescreen is-two-fifths-tablet is-full-mobile">
			<prop-config v-if="currentElement" :element="currentElement" :animations="[]"
				fontable @file-add="fileAdded" @file-remove="fileRemoved"></prop-config>
			<scene-config v-if="!currentElement" :elements="elements" :scene="scene" @choose="chooseElement"></scene-config>
		</div>
	</div>
	<image-cropper ref="cropper" @complete="cropComplete"></image-cropper>
</div>
</template>

<script>
export default {
	name: 'SlideEditor',
	components: {ImageCropper, PropConfig, NavBar, SceneConfig},
	mixins: [],
	data () {
		return {
			previewRatio: '9:16',
			maskStyle: '',
			cornerPosition: {},
			ratios,
			currentElement: null,
			isPlaying: false,
			elements: [],
			scene: {
				background: clone(TPL_BACKGROUND)
			}
		}
	},
	created () {
	
	},
	computed: {
		
	},
	methods: {
  }
}
</script>

<style lang="scss">

</style>
