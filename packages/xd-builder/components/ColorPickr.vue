<template>
  <el-color-picker v-model="psColor" @change="colorChange" size="mini" :show-alpha="true" :predefine="predefineColors" />
</template>

<script>
import { ColorPicker } from 'element-ui'
export default {
  name: 'ColorPickr',
  components: {
    [ColorPicker.name]: ColorPicker
  },
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      psColor: this.value,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)'
      ]
    }
  },
  computed: {

  },

  created () {
    if (this.ctx.predefineColors == null) {
      this.ctx.predefineColors = []
    } else {
      this.predefineColors = this.predefineColors.concat(this.ctx.predefineColors)
    }
  },
  methods: {
    colorChange () {
      if (!this.psColor) {
        this.$emit('remove')
      } else {
        if (this.ctx.predefineColors.indexOf(this.psColor) === -1) {
          this.ctx.predefineColors.push(this.psColor)
        }
        this.$emit('input', this.psColor)
      }
    }
  }
}
</script>

<style lang="scss">

.el-color-dropdown__link-btn {
  border: none;
  color: #333;
  line-height: 24px;
  border-radius: 2px;
  padding: 0 20px;
  cursor: pointer;
  background-color: transparent;
  outline: 0;
  font-size: 12px;
}
.color-picker {
  display: inline-block;
  position: relative;
  z-index: 1111;
  .picker-container {
    position: absolute;
  }
}
</style>
