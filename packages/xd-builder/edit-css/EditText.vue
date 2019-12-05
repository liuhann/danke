<template>
<div class="field has-addons" style="height: 60px;">
  <div class="control field-lb">
    文本
  </div>
  <div class="control" style="width: 230px;">
    <el-input
      type="textarea"
      :rows="2"
      v-model="element.text">
    </el-input>
  </div>
</div>
</template>

<script>
export default {
  name: 'EditText',
  props: {
    element: {
      type: Object
    }
  }
}
</script>

<style scoped>

</style>
