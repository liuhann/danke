<template>
  <el-select v-model="variable.value" size="mini" @change="loadFontFace">
    <el-option v-for="fontface in fonts" :key="fontface.id" :value="fontface.id" :label="fontface.name" :style="fontStyle(fontface)">
      <img v-if="fontface.pic" :src="getImageUrl(fontface.pic)" />
      <span v-else> {{ fontface.name }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option } from 'element-ui'
import RestDAO from '../../utils/restdao.js'
import { loadFontFace } from '../../utils/fontfaces.js'
import { getImageUrl } from '../../utils/getImageUrl.js'

export default {
  name: 'FontFamilyVue',
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    variable: {
      type: Object
    }
  },
  data () {
    return {
      fonts: null
    }
  },
  mounted () {
    this.loadFonts()
  },
  methods: {
    getImageUrl,
    async loadFonts () {
      const fontdao = new RestDAO(this.ctx, 'danke/font')
      if (this.fonts == null) {
        this.fonts = (await fontdao.list()).list
      }
    },
    fontStyle (fontFace) {
      return {
        fontFamily: fontFace.id
      }
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
       
        Toast.clear(true)
      }
      this.$emit('input', fontid)
    },
    async loadFontFace (val) {
      const fontface = this.fonts.filter(fontface => fontface.id === val)[0]
      await loadFontFace(fontface.id, fontface.url)
    }
  }
}
</script>

<style scoped>
img {
  vertical-align: middle;
}

</style>