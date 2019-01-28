<template>
<div class="edit-font">
  <van-cell class="group-title" title="字体" icon="bars"/>
  <edit-len v-model="font.size" label="大小" :with-unit="false"></edit-len>
  <item-block title="颜色">
    <pop-color-picker v-model="font.color"></pop-color-picker>
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
