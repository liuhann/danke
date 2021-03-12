<template>
  <el-select v-model="variable.value" @change="loadFontFace">
    <el-option v-for="fontface in fontFamilies" :key="fontface.id" :value="fontface.id" :label="fontface.name" :style="fontStyle(fontface)" />
  </el-select>
</template>

<script>
import { Select, Option } from 'element-ui'
import { fontFamilies } from '../utils/StyleRegistry'

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
      fontFamilies
    }
  },
  methods: {
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