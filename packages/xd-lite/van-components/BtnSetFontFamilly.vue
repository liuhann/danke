<template>
  <div class="btn-edit-text">
    <van-button round icon="edit" @click="showFontFamilly"></van-button>
    <font-family ref="fontFamilly" @input="updateVariableValue" />
  </div>
</template>

<script>
import FontFamily from '../form/FontFamily'
export default {
  name: "BtnSetFontFamilly",
  components: { FontFamily },
  props: {
    value: {
      type: String
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
    textChanged (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>

</style>
