<template>
<div class="edit-font">
  <edit-len v-model="font.size" label="大小"></edit-len>
  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">颜色</van-col>
    <van-col span="18">
      <pop-color-picker v-model="font.color"></pop-color-picker>
    </van-col>
  </van-row>
</div>
</template>

<script>
import PopColorPicker from './PopColorPicker'
import EditLen from './EditLen'
export default {
  name: 'EditFont',
  components: {
    PopColorPicker,
    EditLen
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      font: this.value
    }
  },

  watch: {
    font () {
      this.$emit('input', this.font)
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
