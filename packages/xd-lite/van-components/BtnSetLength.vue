<template>
  <van-popover
    v-model="show"
    placement="top-start"
  >
    <van-slider :value="value" @change="onChange" />
    <template #reference>
      <van-button round @click="show = true">{{ value }}</van-button>
    </template>
  </van-popover>
</template>

<script>
export default {
  name: "BtnSetLegnth",
  props: {
    value: {
      type: Number
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

</style>
