<template>
  <button type="button" class="pcr-button"></button>
</template>

<script>
import '@simonwep/pickr/dist/pickr.min.css'
import Pickr from '@simonwep/pickr/dist/pickr.min'
export default {
  name: 'ColorPickr',
  props: {
    value: {
      type: String,
    }
  },
  mounted () {
    this.pickr = new Pickr({
      el: this.$el,
      default: this.value,
      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
      ],
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          hex: false,
          rgba: true,
          hsva: false,
          input: true,
          clear: true,
          save: true
        }
      },
      strings: {
        save: '选择',  // Default for save button
        clear: '清除' // Default for clear button
      }
    })
    this.pickr.on('save', (color) => {
      this.$emit('input', color.toRGBA())
    })
  }
}
</script>

<style>
.pcr-app {
  max-width: 80vw;
}
.pcr-button {
  position: relative;
  height: 2em;
  width: 2em;
  padding: .5em;
  cursor: pointer;
  border-radius: .15em;
}
.pickr {
  display: inline-block;
  margin-right: 5px;
}

</style>
