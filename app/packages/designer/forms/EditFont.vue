<template>
<div class="edit-font">
  <van-cell class="group-title" title="字体" icon="bars"/>
  <edit-len v-model="font.size" label="大小" :with-unit="false"></edit-len>
  <item-block title="颜色">
    <pop-color-picker v-model="font.color"></pop-color-picker>
  </item-block>
  <item-block title="对齐">
    <van-radio-group v-model="font.align">
      <van-radio name="left">左</van-radio>
      <van-radio name="center">居中</van-radio>
      <van-radio name="right">右</van-radio>
    </van-radio-group>
  </item-block>
</div>
</template>

<script>
import PopColorPicker from './PopColorPicker'
import EditLen from './EditLen'
import ItemBlock from './ItemBlock'
export default {
  name: 'EditFont',
  components: {
    ItemBlock,
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
    }
  },
  computed: {
    font () {
      return this.value
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
