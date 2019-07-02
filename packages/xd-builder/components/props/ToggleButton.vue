<template>
<a class="button is-small" :class="fieldValue ? 'is-selected is-info': ''"  @click="changeRadioValue">
  <span class="icon is-small">
    <i :class="icon"></i>
  </span>
</a>
</template>

<script>
export default {
  props: {
    icon: {
      type: String
    },
    value: {
      type: Boolean
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
    changeRadioValue () {
      this.fieldValue = !this.fieldValue
    }
  }
}
</script>

<style>

</style>

