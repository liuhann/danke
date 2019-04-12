<template>
<div class="edit-position config-group">
  <item-block title="横向对齐">
    <el-radio v-model="position.horizontal" label="left">左</el-radio>
    <el-radio v-model="position.horizontal" label="center">居中</el-radio>
    <el-radio v-model="position.horizontal" label="right">右</el-radio>
  </item-block>
  <edit-len label="横向偏移" v-model="position.offsetX" :min="-1000" :max="1000"></edit-len>

  <item-block title="纵向对齐">
    <el-radio v-model="position.vertical" label="top">上</el-radio>
    <el-radio v-model="position.vertical" label="center">居中</el-radio>
    <el-radio v-model="position.vertical" label="bottom">下</el-radio>
  </item-block>

  <edit-len label="纵向偏移" v-model="position.offsetY"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import ItemBlock from './ItemBlock'
export default {
  name: 'EditPosition',
  components: {
    ItemBlock,
    EditLen
  },
  props: {
    value: {
      type: Object
    },
    device: {
      type: Object
    }
  },
  data () {
    return {
      // position: this.value
    }
  },
  computed: {
    position () {
      return this.value
    }
  },
  created () {

  }
}
</script>

<style lang="scss">
.position-preview {
  width: 80vw;
  height: 80vw;
}

</style>
