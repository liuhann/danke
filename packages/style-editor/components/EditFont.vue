<template>
<div class="edit-font">
  <edit-len v-model="font.size" label="大小" :with-unit="false"></edit-len>
  <item-block title="颜色">
    <el-color-picker v-model="font.color"></el-color-picker>
  </item-block>
  <item-block title="粗细">
    <el-radio v-model="font.weight" label="normal">细</el-radio>
    <el-radio v-model="font.weight" label="bold">粗</el-radio>
  </item-block>

  <item-block title="对齐">
    <el-radio v-model="font.align" label="left">左</el-radio>
    <el-radio v-model="font.align" label="center">居中</el-radio>
    <el-radio v-model="font.align" label="right">右</el-radio>
  </item-block>
  <edit-len v-model="font.padding" label="边距"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import ItemBlock from './ItemBlock'
export default {
  name: 'EditFont',
  components: {
    ItemBlock,
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
