<template>
  <div class="btn-edit-text">
    <van-button round icon="notes-o" @click="showFontFamilly"></van-button>
    <font-family ref="fontFamilly" @input="input" />
  </div>
</template>

<script>
import FontFamily from '../form/FontFamily.vue'
export default {
  name: "BtnSetFontFamilly",
  components: { FontFamily },
  props: {
    element: {
      type: Object
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    showFontFamilly () {
      this.$refs.fontFamilly.open()
    },
    input (val) {
      this.element.variables.forEach(variable => {
        if (variable.type === 'fontFamily') {
          variable.value = val
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
