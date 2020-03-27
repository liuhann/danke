<template>
  <a class="action" @click="toggleFontBold" :style="fontWeightStyle" style="padding: 0 10px;">B</a>
</template>

<script>
export default {
  name: 'FontWeight',
  props: {
    value: {
      type: Number
    }
  },
  computed: {
    fontWeightStyle () {
      return {
        fontWeight: this.value
      }
    }
  },
  methods: {
    toggleFontBold () {
      let fontWeight = this.value + 200
      if (fontWeight > 600) {
        fontWeight = 200
      }
      this.$emit('input', fontWeight)
    }
  }
}
</script>

<style scoped>

</style>
