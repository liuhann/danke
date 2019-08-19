<template>
<div class="buttons has-addons">
  <span v-for="option in options" :key="option.key" :class="fieldValue === option.key? 'is-selected is-info': ''" class="button is-small" @click="changeRadioValue(option.key)">
    <span class="icon is-small" v-if="option.icon">
      <i v-if="option.icon" :class="option.icon"></i>{{option.value}}
    </span>
    {{option.value}}
  </span>
</div>
</template>
<script>
export default {
  name: 'ToggleGroupedButton',
  props: {
    value: {
      type: [String, Number]
    },
    options: {
      type: [Array, Object]
    }
  },
  computed: {
    fieldValue: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    changeRadioValue (v) {
      this.fieldValue = v
    }
  }
}
</script>

<style lang="scss">

</style>

