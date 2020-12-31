<template>
  <van-popover v-model="show" trigger="click" :placement="placement" round>
    <div class="colors">
      <div>已有颜色</div>
      <van-button v-for="color in defaultColors" :key="color" class="picker-color" :color="color" @click="chooseColor(color)" />
    </div>
    <div class="colors">
      <div>常用颜色</div>
      <van-button v-for="color in presetColors" :key="color" class="picker-color" :color="color" @click="chooseColor(color)" />
    </div>
    <template #reference>
      <slot>
        <van-button round :color="value" :style="{borderColor: '#eee'}" icon="arrow-down" />
      </slot>
    </template>
  </van-popover>
</template>

<script>
export default {
  name: "BtnColorPicker",
  props: {
    value: {
      type: String,
    },
    presetColors: {
      type: Array,
      default() {
        return ['#000000', '#545454', '#737373', '#a6a6a6', '#d9d9d9', '#ffffff', '#ff1616', '#ff5757',
          '#ff66c4', '#cb6ce6', '#8c52ff', '#5e17eb', '#03989e', '#00c2cb', '#5ce1e6', '#38b6ff',
          '#5271ff', '#004aad', '#008037', '#7ed957', '#c9e265', '#ffde59', '#ffbd59', '#ff914d']
      }
    },
    defaultColors: {},
    placement: {
      type: String,
      default: 'right-end'
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    chooseColor (color) {
      this.$emit('input', color)
    }
  }
}
</script>

<style scoped lang="scss">
.colors {
  width: 260px;
  padding: 10px;
  .picker-color {
    border: 1px solid #eee;
    margin: 2px;
    width: 36px;
    height:36px;
  }
}
</style>
