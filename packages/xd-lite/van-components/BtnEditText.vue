<template>
  <div class="btn-edit-text">
    <van-button round icon="edit" @click="show=true"></van-button>
    <van-popup v-model="show" position="top">
      <van-search
        v-model="value"
        left-icon="edit"
        @input="textChanged"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "BtnEditText",
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    textChanged (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>

</style>
