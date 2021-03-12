<template>
  <div class="btn-edit-text">
    <van-button round @click="show=true">内容編輯</van-button>
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