<template>
	<van-tabs v-model="elementCollapseName" class="tabs-select-element">
		<van-tab title="移动设备" name="basic">
			<van-cell title="移动设备全屏" :clickable="true" label="适用于手机全屏页面展示，例如手机屏幕比例为9:16" @click="choose('full')">
				<svg width="40" height="40"  viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" slot="icon">
					<g>
						<rect height="96" width="53" y="17.5" x="37.5" stroke-width="3.5" stroke="#000" fill="#fff"/>
					</g>
				</svg>
			</van-cell>
			<van-cell title="正方形" icon="edit" :clickable="true" label="屏幕长宽比为1:1，可以嵌入页面滚动查看" @click="choose('1x1')">
				<svg width="40" height="40"  viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" slot="icon">
					<g>
						<rect height="78" width="78" y="25" x="25" stroke-width="3.5" stroke="#000" fill="#fff"/>
						<text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="35" y="75" x="38.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">1:1</text>
					</g>
				</svg>
			</van-cell>
			<van-cell title="长方形" icon="edit" :clickable="true" label="屏幕长宽比为2:3，可以嵌入页面滚动查看" @click="choose('3x2')">
				<svg width="40" height="40"  viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" slot="icon">
					<g>
						<rect stroke="#000" id="svg_1" height="61.000002" width="91.999996" y="36" x="18" stroke-width="3.5" fill="#fff"/>
						<text fill="#000000" stroke="#000" stroke-width="0" x="38.5" y="77" font-size="35" font-family="Helvetica, Arial, sans-serif" text-anchor="start" xml:space="preserve">3:2</text>
					</g>
				</svg>
			</van-cell>
		</van-tab>
	</van-tabs>
</template>

<script>
export default {
	name: 'TabChooseType',
	data () {
		return {
			elementCollapseName: 0
		}
	},
	methods: {
    choose (type) {
      this.$emit('choose', type)
		}
	}
}
</script>

<style scoped>

</style>
