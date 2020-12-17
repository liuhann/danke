<template>
  <van-popup
    v-model="show"
    position="bottom"
  >
    <van-picker show-toolbar title="标题" :columns="fontColumns" @confirm="onConfirm" />
  </van-popup>
</template>

<script>
import { fontFamilies, addFontFace, loadFontFace } from '../../utils/fontfaces'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
import { Toast } from 'vant'
import RestDAO from '../../utils/restdao'
export default {
  name: 'FontFamily',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      fonts: null,
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
    },
    fontColumns () {
      return (this.fonts|| []).map(fontface => {
        if (fontface.pic) {
          return `<img data-id="${fontface.id}" src="${this.getImageUrl(fontface.pic)}"/>`
        } else {
          return fontface.name
        }
      })
    }
  },
  mounted () {
    this.loadFonts()
  },
  methods: {
    async loadFonts () {
      const fontdao = new RestDAO(this.ctx, 'danke/font')
      if (this.fonts == null) {
        this.fonts =  (await fontdao.list()).list
      }
    },
    getImageUrl,
    open () {
      this.show = true
    },
    async onConfirm (payload) {
      let fontid = null
      if (payload.startsWith('<img')) {
        const ddd = document.createElement('div')
        ddd.innerHTML = payload
        fontid = ddd.firstElementChild.dataset.id
      } else {
        fontid = ''
      }
      if (fontid) {
        const fontface = this.fonts.filter(fontface => fontface.id === fontid)[0]
        Toast.loading('正在加载选定的字体')
        this.show = false
        await loadFontFace(fontface.id, fontface.url)
        Toast.clear(true)
      }
      this.$emit('input', fontid)
    }
  }
}
</script>
