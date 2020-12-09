<template>
  <div class="font-family">
    <van-button size="small" square @click="show = true">{{ currentFont }}</van-button>
    <van-popup
      v-model="show"
      position="bottom"
    >
      <van-picker show-toolbar title="标题" :columns="fonts" @confirm="onConfirm" />
    </van-popup>
  </div>
</template>

<script>
import { fontFamilies } from '../../xd-builder/utils/StyleRegistry'
import { Toast } from 'vant'
export default {
  name: 'FontFamily',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      fonts: fontFamilies.map(fontface => fontface.name),
      show: false
    }
  },
  computed: {
    currentFont () {
      try {
        return fontFamilies.filter(fontface => fontface.id === this.value)[0].name
      } catch (e) {
        return '默认字体'
      }
    }
  },
  methods: {
    async onConfirm (payload) {
      Toast.loading('正在加载选定的字体')
      const font = fontFamilies.filter(fontface => fontface.name === payload)[0]
      this.show = false
      await this.ctx.styleRegistry.addFontFace(font)
      Toast.clear(true)
      this.$emit('input', font.id)
    },
    fontStyle (fontFace) {
      return {
        fontFamily: fontFace.id
      }
    },
    loadFontFace (val) {
      this.ctx.styleRegistry.addFontFace(this.fontFamilies.filter(face => face.id === val)[0])
    }
  }
}
</script>

<style scoped>

</style>
