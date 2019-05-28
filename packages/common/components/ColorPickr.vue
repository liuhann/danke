<template>
  <div class="color-picker">
    <el-color-picker v-model="psColor" @change="colorChange" size="mini" show-alpha="true"></el-color-picker>
    <i class="icon-trash-empty" @click="removeColor"></i>
  </div>
</template>

<script>
import { ColorPicker } from 'element-ui'
export default {
  name: 'ColorPickr',
  components: {
    [ColorPicker.name]: ColorPicker,
  },
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      psColor: this.value
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
    colorChange () {
      this.$emit('input', this.psColor)
    },
    toggleShowPicker () {
      this.pickerShow = !this.pickerShow
    },
    removeColor () {
      this.$emit('remove')
    },

    updateValue (v) {
      this.$emit('input', `rgba(${v.rgba.r}, ${v.rgba.g}, ${v.rgba.b}, ${v.rgba.a})`)
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
  position: relative;
  z-index: 1111;
  margin-bottom: .3rem;
  .icon-trash-empty {
    margin-left: 1rem;
    color: #999;
    display: inline-block;
    vertical-align: top;
  }
  .picker-container {
    position: absolute;
  }
}
</style>
