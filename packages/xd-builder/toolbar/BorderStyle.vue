<template>
<el-tooltip content="边框样式" >
  <el-select v-model="variable.value" placeholder="请选择" size="mini">
    <el-option
      v-for="item in LINE_STYLES"
      :key="item.key"
      :label="item.value"
      :value="item.key">
    </el-option>
  </el-select>
</el-tooltip>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
export const LINE_STYLES = [{
  key: 'solid',
  value: '实线'
}, {
  key: 'dotted',
  value: '虚点线'
}, {
  key: 'dashed',
  value: '虚划线'
}, {
  key: 'double',
  value: '双层'
}, {
  key: 'none',
  value: '无边框'
}, {
  key: 'inset',
  value: '嵌入线'
}]
export default {
  name: 'BorderStyle.vue',
  mixins: [ toolbarPopMixin ],
  data () {
    return {
      LINE_STYLES
    }
  }

}
</script>

<style scoped>

</style>
