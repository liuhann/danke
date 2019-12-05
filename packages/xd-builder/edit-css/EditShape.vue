<template>
<div class="field has-addons">
  <p class="control field-lb">
    形状
  </p>
  <div class="control" style="width: 80px;">
    <el-select v-model="element.shape" size="mini">
      <el-option v-for="option in shapes" :value="option.value" :key="option.value" :label="option.label"/>
    </el-select>
  </div>
</div>
</template>

<script>
import { Select, Option } from 'element-ui'
export default {
  name: 'EditShape',
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    element: {
      type: Object
    }
  },
  data () {
    return {
      shapes: [{
        value: 'circle',
        label: '圆形'
      }, {
        value: 'rect',
        label: '矩形'
      }]
    }
  }
}
</script>

<style scoped>

</style>
