<template>
  <van-popover
    v-model="show"
    trigger="click"
    placement="right"
  >
    <div class="slider">
      <van-slider :value="value" @input="onChange" />
    </div>
    <template #reference>
      <van-button round>{{ label }}</van-button>
    </template>
  </van-popover>
</template>

<script>
export default {
  name: "BtnSetLegnth",
  props: {
    value: {
      type: Number
    },
    label: {
      type: String
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    onChange(value) {
      this.$emit('input', value)
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
.slider {
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 42px;
  padding: 0 20px;
}
</style>
