<template>
  <div class="color-picker">
    <button type="button" :style="btnStyle" class="picker-button" @click="toggleShowPicker"></button>
    <div class="picker-container" v-show="pickerShow">
      <photoshop-picker v-model="psColor"  @input="updateValue"/>
    </div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color'
export default {
  name: 'ColorPickr',
  components: {
    'photoshop-picker': Chrome
  },
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      psColor: this.value,
      pickerShow: false
    }
  },
  computed: {
    btnStyle () {
      return {
        backgroundColor: this.value
      }
    }
  },
  methods: {
    toggleShowPicker () {
      this.pickerShow = !this.pickerShow
    },

    updateValue (v) {
      this.$emit('input', `rgba(${v.rgba.r}, ${v.rgba.g}, ${v.rgba.b}, ${v.rgba.a})`)
    }
  }
}
</script>

<style lang="scss">
.color-picker {
  position: relative;
  z-index: 1111;
  display: inline-block;
  margin-right: .3rem;
  .picker-button {
    width: 1.5rem;
    height: 1.5rem;
  }
  .picker-container {
    position: absolute;
  }
}
</style>
