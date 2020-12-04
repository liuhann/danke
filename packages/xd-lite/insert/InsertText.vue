<template>
  <van-cell-group>
    <van-cell v-for="(template, index) in fontTemplates" :key="index" clickable size="large" @click="insertText(template)">
      <div :style="fontStyle(template)">{{ template.text }}</div>
    </van-cell>
  </van-cell-group>
</template>

<script>
import { fontTemplates } from '../../xd-builder/left/texts'
import { assignVariables } from '../../xd-builder/mixins/renderUtils'

export default {
  name: 'InsertText',
  props: {
    viewBox: {
      type: Object
    }
  },
  data () {
    return {
      fontTemplates
    }
  },
  methods: {
    fontStyle (template) {
      const style = {}
      Object.assign(style, template.style)
      assignVariables(style, template.variables)
      style.textAlign = 'left'
      return style
    },

    insertText (template) {
      const rectWidth = this.viewBox ? this.viewBox.width : 320

      const cloned = JSON.parse(JSON.stringify(template))

      const fontSizeVaraiable = cloned.variables.filter(v => v.type === 'fontSize')[0]

      if (fontSizeVaraiable) {
        fontSizeVaraiable.value = Math.floor(rectWidth * (template.size || 0.07))
      }
      this.$emit('insert', cloned)
    }
  }
}
</script>

<style scoped>

</style>